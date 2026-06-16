import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PostPilot — AI LinkedIn Content Creator",
  description:
    "Generate, schedule, and analyze LinkedIn content with AI. Grow your audience on autopilot.",
  icons: {
    icon: "/Final_logo.png",
    shortcut: "/Final_logo.png",
    apple: "/Final_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
