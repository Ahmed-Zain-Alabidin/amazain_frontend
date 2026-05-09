import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AxiosInterceptor from "@/components/AxiosInterceptor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amazain — Premium E-Commerce",
  description: "Discover premium products at the best prices on Amazain.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AxiosInterceptor>
          {children}
        </AxiosInterceptor>
      </body>
    </html>
  );
}
