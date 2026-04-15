import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Caveat, Syne_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const syneMono = Syne_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-syne-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday, Riya 🌟",
  description: "A universe built for one.",
  other: { "theme-color": "#050810" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${cormorant.variable}
        ${dmSans.variable}
        ${caveat.variable}
        ${syneMono.variable}
        h-full antialiased
      `}
      style={{ background: "#050810" }}
    >
      <body
        className="min-h-full bg-[#050810] text-[#fffde8]"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
