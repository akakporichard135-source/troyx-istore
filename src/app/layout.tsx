import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TroyX iStore — Home of Original Apple Products | Accra, Ghana",
  description:
    "TroyX iStore in Bawaleshie, East Legon, Accra. Premier retailer of authentic original Apple devices with full warranty.",
  keywords: [
    "Apple Store Accra",
    "iPhone Ghana",
    "MacBook Accra",
    "TroyX iStore",
    "Apple East Legon",
    "Bawaleshie electronics",
  ],
  authors: [{ name: "TroyX iStore" }],
  openGraph: {
    title: "TroyX iStore — Home of Original Apple Products",
    description: "Original Apple hardware with warranty in East Legon, Accra, Ghana.",
    url: "https://troyxistore.com",
    siteName: "TroyX iStore",
    locale: "en_GH",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
