import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Guess the Number",
  description: "Admin panel for Guess the Number game.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Painel Administrativo</h1>
      </header>
      <div className="flex justify-center">
        {children}
      </div>
    </div>
  );
}
