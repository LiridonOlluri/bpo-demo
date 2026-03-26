import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://averion.ch"),
  title: "meTru ERP - BPO",
  description: "meTru ERP - BPO Operations & Workforce Management Platform",
  icons: {
    icon: "/meTru_logo.svg",
    apple: "/meTru_logo.svg",
  },
  openGraph: {
    title: "meTru ERP - BPO",
    description: "meTru ERP - BPO Operations & Workforce Management Platform",
    url: "https://metru-bpo.netlify.app",
    siteName: "meTru ERP - BPO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "meTru ERP - BPO",
    description: "meTru ERP - BPO Operations & Workforce Management Platform",
  },
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
              <ModalProvider>
                {children}
                <Toaster position="top-right" richColors />
              </ModalProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
