import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bisi Interiors | Designing Spaces. Creating Experiences.",
  description: "Premium barber chairs, salon equipment, office furniture and interior essentials from Bisi Interiors.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
