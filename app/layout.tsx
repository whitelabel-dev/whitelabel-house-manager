import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Manager · whitelabel.dev",
  description: "One dashboard for everything that touches your home — systems, vendors, belongings, subscriptions, documents, calendar, household.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
