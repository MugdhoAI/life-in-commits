import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life in Commits",
  description: "An interactive lifetime timeline visualized as a GitHub style contribution graph.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
