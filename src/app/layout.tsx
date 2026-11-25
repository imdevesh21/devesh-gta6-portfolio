import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { VisitorTracker } from "@/components/VisitorTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://devesh-gta6-portfolio.vercel.app"),
  title: {
    default: "VI // Devesh Sharma — Full-Stack Developer",
    template: "%s | VI // Devesh Sharma",
  },
  description:
    "Interactive GTA-VI (Vice City / State of Leonida) themed portfolio of Devesh Sharma. Full Stack Developer specializing in Next.js, Node.js, TypeScript, and high-velocity API performance.",
  keywords: [
    "Devesh Sharma",
    "Full Stack Developer",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Three.js",
    "GSAP",
    "GTA 6 Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: "Devesh Sharma" }],
  openGraph: {
    title: "VI // Devesh Sharma — Full-Stack Developer",
    description:
      "Interactive 3D Grand Theft Auto VI developer portfolio built with Next.js 14, Three.js & GSAP.",
    url: "https://devesh-gta6-portfolio.vercel.app",
    siteName: "VI // Devesh Sharma",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0c0119] text-white">
        <PortfolioProvider>
          <VisitorTracker />
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
