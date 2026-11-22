import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";

export const metadata: Metadata = {
  title: "Devesh Sharma // Full-Stack Architect [GTA-6 Portfolio]",
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
    title: "Devesh Sharma // Full-Stack Architect [GTA-6 Portfolio]",
    description:
      "Interactive 3D Grand Theft Auto VI developer portfolio built with Next.js 14, Three.js & GSAP.",
    url: "https://deveshportfolio.vercel.app",
    siteName: "Devesh Sharma Portfolio",
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
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
