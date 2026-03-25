import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "meTru ERP - BPO",
  description: "BPO Operations & Workforce Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster position="top-right" richColors />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
