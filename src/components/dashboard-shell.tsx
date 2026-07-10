import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Button asChild variant="ghost" className="mb-6 text-zinc-400">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-normal text-zinc-100 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
