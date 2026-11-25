import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estancias | Alojamientos para descubrir",
  description: "Explora alojamientos vacacionales y encuentra tu próxima estancia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}