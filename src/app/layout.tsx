import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://foundation-app-rose.vercel.app"),
  title: {
    default: "Talal Shah | Software Developer & CS Student",
    template: "%s | Talal Shah",
  },
  description:
    "Portfolio of Talal Shah. Full-stack web applications, real-time 3D browser experiences, and automated CI/CD testing pipelines built with Next.js and TypeScript.",
  keywords: [
    "Talal Shah",
    "Software Developer",
    "Next.js Portfolio",
    "Three.js 3D Web",
    "Full Stack Developer",
    "Playwright Vitest CI/CD",
  ],
  authors: [{ name: "Talal Shah" }],
  creator: "Talal Shah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foundation-app-rose.vercel.app",
    title: "Talal Shah | Software Developer Portfolio",
    description:
      "Interactive 3D graphics, automated test suites, and serverless backend API integrations.",
    siteName: "Talal Shah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talal Shah | Software Developer Portfolio",
    description:
      "Full-stack web applications, real-time 3D graphics, and CI/CD pipelines.",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}