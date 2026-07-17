"use server";

import { db } from "@/db";
import { enquiries } from "@/db/schema";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = (String(formData.get("source") ?? "").trim() || "quote-form").slice(0, 40);

  // Honeypot — bots fill hidden fields; humans don't.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "Thank you! Your enquiry has been received." };
  }

  if (name.length < 2) return { status: "error", message: "Please enter your full name." };
  if (phone.replace(/\D/g, "").length < 7)
    return { status: "error", message: "Please enter a valid phone number." };
  if (!emailRe.test(email))
    return { status: "error", message: "Please enter a valid email address." };
  if (message.length < 5)
    return { status: "error", message: "Please tell us a little about what you need." };

  try {
    await db.insert(enquiries).values({ name, phone, email, message, source });
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
