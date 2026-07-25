import type { Metadata } from "next";
import { Cormorant, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import GridBackground from "@/components/GridBackground";
import Nav from "@/components/Nav";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-monospace",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "José Henrique — Full-Stack Developer",
  description:
    "Portfolio of José Henrique, a Full-Stack Developer from Brazil focused on AI agents, automation, and scalable architectures.",
  keywords: [
    "Full-Stack Developer",
    "AI Engineer",
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Python",
    "José Henrique",
  ],
  authors: [{ name: "José Henrique Oliveira de Carvalho" }],
  openGraph: {
    title: "José Henrique — Full-Stack Developer",
    description:
      "Building systems that think, not just apps. Focused on AI agents, automation and scalable architectures.",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <GridBackground/>
    <html lang="en" className={`${cormorant.variable} ${ibmPlexMono.variable} smooth-wrapper`}>
      <body className="smooth-content">
        <Nav/>
        <SmoothScrollProvider>
          
        {children}
        </SmoothScrollProvider>
        </body>
    </html>
    </>
  );
}
