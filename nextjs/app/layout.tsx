import type { Metadata } from "next";
import "@/app/globals.css";

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
    <html lang="id" data-theme="garuda">
      <body>{children}</body>
    </html>
  );
}