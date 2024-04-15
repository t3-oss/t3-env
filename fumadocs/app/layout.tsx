import { cn } from "@/utils/cn";
import { baseUrl, createMetadata } from "@/utils/metadata";
import { RootProvider } from "fumadocs-ui/provider";
import "fumadocs-ui/twoslash.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";
import "./global.css";

export const metadata = createMetadata({
  title: {
    template: "%s | Fumadocs",
    default: "Fumadocs",
  },
  description: "The Next.js framework for building documentation sites",
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const CalSans = localFont({
  src: "./calsans.ttf",
  variable: "--font-cal",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ViewTransitions>
      <html lang="en" className={cn("bg-background")} suppressHydrationWarning>
        <body
          className={cn(
            GeistSans.variable,
            GeistMono.variable,
            CalSans.variable,
            "flex min-h-screen flex-col font-sans antialiased",
          )}
        >
          <div className="relative flex min-h-screen flex-col">
            <RootProvider>{children}</RootProvider>
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}
