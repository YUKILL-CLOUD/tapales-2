import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tapales Vet Clinic",
  description: "All purpose veterinary clinic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <ToastContainer position="top-right" theme="light"/>
          </body>
        </html>
    </ClerkProvider>
  );
}
