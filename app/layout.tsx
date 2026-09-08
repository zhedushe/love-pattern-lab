import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love Pattern Lab — Relationship self-reflection",
  description: "Relationship and personality self-reflection quizzes with free basic results and optional US$2.99 full reports."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
