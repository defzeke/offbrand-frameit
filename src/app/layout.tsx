import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FrameProvider } from "@/contexts/FrameContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "FrameIt",
  description: "Transform your images into stunning frames with custom captions and effects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}} antialiased`}
      >
        <FrameProvider>
          {children}
        </FrameProvider>
      </body>
    </html>
  );
}
