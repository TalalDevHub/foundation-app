import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://foundation-app-rose.vercel.app"),
  title: {
    default: "Talal Shah | Software Developer & CS Student",
    template: "%s | Talal Shah",
  },
  description:
    "Portfolio of Talal Shah. Full-stack web applications, real-time 3D browser experiences, and automated CI/CD testing pipelines built with Next.js and TypeScript.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foundation-app-rose.vercel.app",
    title: "Talal Shah | Software Developer & CS Student",
    description:
      "Full-stack applications, real-time 3D browser graphics, and automated CI/CD pipelines.",
    siteName: "Talal Shah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talal Shah | Software Developer & CS Student",
    description:
      "Full-stack applications, real-time 3D browser graphics, and automated CI/CD pipelines.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
        <div className="flex-1">{children}</div>

        <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur py-8 px-4 text-center">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 Talal Shah. Built with Next.js, Three.js & Resend.
            </p>

            <a
              href="https://internship-badge.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all duration-200 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                FlyRank Certified Graduate
              </span>
            </a>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
