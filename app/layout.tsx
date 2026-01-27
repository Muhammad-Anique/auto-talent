import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import LoadingOverlay from "@/context/LoadingOverlay";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { HtmlWrapper } from "@/components/providers/html-wrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoTalent",
  description: "Your Ultimate AI-Powered Resume Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <HtmlWrapper>
            <LoadingProvider>
              <LoadingOverlay />
              {children}
            </LoadingProvider>
          </HtmlWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
