import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Carrot",
    default: "Carrot",
  },
  description: "모든 것을 사고 파세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}>{children}</body>
    </html>
  );
}
