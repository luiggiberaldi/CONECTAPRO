import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/features/auth/components/AuthProvider";
import ToastContainer from "@/components/shared/ToastContainer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ConectaPro - Servicios Profesionales en Venezuela",
  description: "Conecta de forma rápida, segura y confiable con profesionales calificados en tu zona.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ConectaPro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${outfit.variable} font-sans antialiased h-full bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
