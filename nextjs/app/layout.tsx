import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garuda Blog",
  description: "Blog sederhana dengan Laravel + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="light">
      <body>{children}</body>
    </html>
  );
}