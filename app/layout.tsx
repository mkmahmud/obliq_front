import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Obliq",
  description: "TanStack Query setup with injectable base API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body
        className={`${onest.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
