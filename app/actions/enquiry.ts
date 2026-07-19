"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { isDisposableEmail, isValidEmail, normalizeEmail } from "@/lib/email";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Rate-limit windows / caps.
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_MAX = 3;
const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const IP_MAX = 8;
// Forms completed faster than this are almost certainly automated.
const MIN_FILL_MS = 2000;

const GENERIC_OK = "Thank you! Your enquiry has been received.";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

async function getClientIpHash(): Promise<string | null> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : h.get("x-real-ip") ?? "").trim();
  return ip ? hashIp(ip) : null;
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\.|\[url|<a\s/gi) ?? []).length;
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const message = String(formData.get("message") ?? "").trim();
  const source = (String(formData.get("source") ?? "").trim() || "quote-form").slice(0, 40);
  const ts = Number(formData.get("ts"));

  // --- Spam signals: respond with a generic success so bots learn nothing ---
  // 1) Honeypot — a hidden field only bots fill in.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: GENERIC_OK };
  }
  // 2) Submitted implausibly fast after the form rendered.
  if (Number.isFinite(ts) && ts > 0 && Date.now() - ts < MIN_FILL_MS) {
    return { status: "success", message: GENERIC_OK };
  }
  // 3) Link-stuffed message (classic spam).
  if (countLinks(message) > 2) {
    return { status: "success", message: GENERIC_OK };
  }

  // --- Validation ---
  if (name.length < 2) return { status: "error", message: "Please enter your full name." };
  if (phone.replace(/\D/g, "").length < 7)
    return { status: "error", message: "Please enter a valid phone number." };
  if (!isValidEmail(email))
    return { status: "error", message: "Please enter a valid email address." };
  if (isDisposableEmail(email))
    return { status: "error", message: "Please use a permanent, non-disposable email address." };
  if (message.length < 5)
    return { status: "error", message: "Please tell us a little about what you need." };
  if (message.length > 4000)
    return { status: "error", message: "Your message is too long — please shorten it." };

  // --- Rate limiting (DB-backed; fails open if the DB is unreachable) ---
  const ipHash = await getClientIpHash();
  try {
    const [byEmail] = await db
      .select({ n: count() })
      .from(enquiries)
      .where(
        and(eq(enquiries.email, email), gte(enquiries.createdAt, new Date(Date.now() - EMAIL_WINDOW_MS))),
      );
    if (Number(byEmail?.n ?? 0) >= EMAIL_MAX) {
      return {
        status: "error",
        message: "We've already received your recent enquiry — our team will be in touch shortly.",
      };
    }
    if (ipHash) {
      const [byIp] = await db
        .select({ n: count() })
        .from(enquiries)
        .where(
          and(eq(enquiries.ipHash, ipHash), gte(enquiries.createdAt, new Date(Date.now() - IP_WINDOW_MS))),
        );
      if (Number(byIp?.n ?? 0) >= IP_MAX) {
        return {
          status: "error",
          message: "Too many enquiries from this connection. Please try again in a little while.",
        };
      }
    }
  } catch (err) {
    console.warn("[enquiry] rate-limit check skipped:", err);
  }

  // --- Persist ---
  try {
    await db.insert(enquiries).values({ name, phone, email, message, source, ipHash });
    return {
      status: "success",
      message: "Thank you! Your enquiry has been received — our team will contact you shortly.",
    };
  } catch (err) {
    console.error("[enquiry] insert failed:", err);
    return {
      status: "error",
      message: "Something went wrong saving your enquiry. Please call us directly.",
    };
  }
}
