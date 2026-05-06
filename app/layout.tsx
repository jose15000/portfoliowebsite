import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
