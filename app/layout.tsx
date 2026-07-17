import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modernfiresafety.example"),
  title: {
    default: "Modern Fire Safety Solution — Complete Fire Safety Solution",
    template: "%s · Modern Fire Safety Solution",
  },
  description:
    "Authorised fire safety dealer with 20+ years of experience. Installation, fire alarm & hydrant systems, extinguisher supply, refilling, AMC, testing and training for homes, offices and industry.",
  keywords: [
    "fire safety",
    "fire extinguisher",
    "fire alarm system",
    "fire hydrant",
    "AMC",
    "fire safety training",
    "New Delhi",
  ],
  openGraph: {
    title: "Modern Fire Safety Solution",
    description:
      "Complete fire safety solution — backed by two decades of hands-on expertise.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
