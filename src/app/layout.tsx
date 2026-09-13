import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talal Portfolio & Foundation",
  description: "Foundations, A11y Playground & AI Streaming Chat",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "AI Assistant" },
  { href: "/playground", label: "Playground" },
  { href: "/identity", label: "Identity Kit" },
  { href: "/images", label: "Image Curation" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
  { href: "/health", label: "Health Check" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-emerald-600">
              Talal<span className="text-slate-900">.</span>
            </Link>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto text-sm font-medium py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-emerald-600 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
