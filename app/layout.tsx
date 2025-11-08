import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How to Understand Women | The Ultimate Relationship Survival Game",
  description: "Can you survive the ultimate relationship test? Play the most hilarious interactive game about understanding women. 161 scenarios, brutal narrator, infinite gameplay. Free to play!",
  keywords: "relationship game, dating game, understanding women, comedy game, interactive game, relationship quiz, dating simulator, funny game, browser game, free game",
  authors: [{ name: "HTUW Game" }],
  creator: "HTUW",
  publisher: "HTUW",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://how-to-understand-women.vercel.app',
    title: 'How to Understand Women | The Ultimate Relationship Survival Game',
    description: 'Can you survive the ultimate relationship test? Play the most hilarious interactive game about understanding women. 161 scenarios, brutal narrator, infinite gameplay.',
    siteName: 'How to Understand Women',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'How to Understand Women - Relationship Survival Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Understand Women | The Ultimate Relationship Survival Game',
    description: 'Can you survive the ultimate relationship test? 161 scenarios, brutal narrator, infinite gameplay. Free to play!',
    images: ['/og-image.png'],
    creator: '@htuwgame',
  },
  alternates: {
    canonical: 'https://how-to-understand-women.vercel.app',
  },
  category: 'game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Verification - Does NOT show ads, just verifies site */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5706346773955050"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
