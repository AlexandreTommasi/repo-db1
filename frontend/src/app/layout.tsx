import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/game";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guess the Number Game",
  description: "A simple number guessing game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <GameProvider>
          <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
