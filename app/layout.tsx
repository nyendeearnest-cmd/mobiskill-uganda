import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MobiSkill Uganda",
  description:
    "Learn practical digital skills, practice through real challenges, and discover opportunities in Uganda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}