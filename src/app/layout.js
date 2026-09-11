import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "@/context/SessionContext";
import { AuthProvider } from "@/context/AuthContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BariVivah",
  description: "BariVivah - Matrimonial Platform",
  icons: {
    icon: [
      { url: "/admin_logo.png", href: "/admin_logo.png" },
      { url: "/admin-logo.png", href: "/admin-logo.png" },
    ],
    shortcut: "/admin_logo.png",
    apple: "/admin_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <link rel="icon" type="image/png" href="/admin_logo.png" />
        <link rel="shortcut icon" type="image/png" href="/admin_logo.png" />
        <link rel="apple-touch-icon" href="/admin_logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-rose-50 to-amber-50`}
      >
        <AuthProvider>
        <SessionProvider>
           {children}
        </SessionProvider>
        </AuthProvider>
       
      </body>
    </html>
  );
}
