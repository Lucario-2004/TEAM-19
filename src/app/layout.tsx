import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/ui/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGRO-TWIN - Agricultural Digital Twin Platform",
  description: "Revolutionary agricultural digital twin platform with AI-powered analysis, 3D field simulation, and expert consultation system featuring CAG architecture and regression learning.",
  keywords: ["AGRO-TWIN", "Agriculture", "Digital Twin", "AI", "3D Simulation", "Crop Analysis", "CAG", "Machine Learning", "Farm Management"],
  authors: [{ name: "AGRO-TWIN Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AGRO-TWIN - Agricultural Digital Twin Platform",
    description: "Revolutionary AI-powered agricultural platform with 3D simulation and expert consultation",
    url: "https://agrotwin.ai",
    siteName: "AGRO-TWIN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGRO-TWIN - Agricultural Digital Twin Platform",
    description: "Revolutionary AI-powered agricultural platform with 3D simulation and expert consultation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
