import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medical Management System",
  description: "Manage patients, medications, and treatment assignments",
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
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                Medical Management System
              </Link>
              <div className="hidden sm:flex gap-6">
                <Link href="/patients/new" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                  Patients
                </Link>
                <Link href="/medications/new" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                  Medications
                </Link>
                <Link href="/assignments/new" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                  Assignments
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
