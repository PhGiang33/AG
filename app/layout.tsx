// File nay la RootLayout (Bo cuc goc) cua toan bo ung dung Next.js
// Day la noi khai bao cac the html, body va nap font chu dung chung.

import type { Metadata } from "next";
import { Inter, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

// Khoi tao font Inter de dung cho toan bo cac van ban binh thuong (font-sans)
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Khai bao the Meta (chua the title, description hien thi tren tab trinh duyet)
export const metadata: Metadata = {
  title: "Enterprise AI Portal - VinaCorp",
  description: "Cổng thông tin và Trợ lý ảo AI thế hệ mới dành cho Doanh nghiệp.",
};

// Component RootLayout boc lay toan bo cac page ben trong no (bien children)
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        // Dua cac bien CSS cua font vao body de tailwind su dung
        className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {/* ThemeProvider ho tro chuyen doi Dark/Light mode cho toan bo he thong */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
