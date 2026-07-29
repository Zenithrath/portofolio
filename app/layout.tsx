import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Djibril Rangga Deja | Portfolio",
    template: "%s | Djibril Rangga Deja",
  },
  description: "Portfolio Djibril Rangga Deja, mahasiswa Teknologi Informasi Universitas Brawijaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
