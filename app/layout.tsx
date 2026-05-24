import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faith & Joe's Wedding | 27 June, 2026",
  description: "Join us as we celebrate the union of Faith and Joe. RSVP, view the venue, and be part of our special day.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>",
  },
  openGraph: {
    title: "Faith & Joe's Wedding 💍",
    description: "Join us as we celebrate the union of Faith and Joe on June 27, 2026. You are invited!",
    url: "https://www.faithwedsjoe2026.com.ng",
    siteName: "Faith & Joe's Wedding",
    images: [
      {
        url: "https://www.faithwedsjoe2026.com.ng/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Faith & Joe Wedding",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith & Joe's Wedding 💍",
    description: "You are invited! Join us on June 27, 2026.",
    images: ["https://www.faithwedsjoe2026.com.ng/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}