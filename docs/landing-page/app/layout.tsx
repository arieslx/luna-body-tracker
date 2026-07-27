import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luna Body Tracker｜属于你的身心记录",
  description: "本地优先、开放可迁移的身心记录系统。记录身体信号，看见长期模式，始终拥有自己的数据。",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  openGraph: {
    title: "Luna Body Tracker",
    description: "Your body. Your patterns. Your data.",
    images: [{ url: "/og.png", width: 1536, height: 877, alt: "Luna Body Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Body Tracker",
    description: "Your body. Your patterns. Your data.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
