"use client";

import Link from "next/link";
import { BadgeDollarSign, Calculator, Search, TrendingDown, Youtube } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { dashboards } from "@/lib/dashboards";
import { useMemo, useState } from "react";

const icons = {
  TrendingDown,
  Calculator,
  BadgeDollarSign,
  Youtube
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return dashboards;
    return dashboards.filter((dashboard) => `${dashboard.name} ${dashboard.description}`.toLowerCase().includes(needle));
  }, [query]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-normal text-zinc-100 sm:text-4xl">Dashboards</h1>
          <p className="mt-2 text-sm text-zinc-400">Small static tools served under one domain.</p>
        </header>

        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dashboards..."
              className="h-11 pl-9"
              aria-label="Search dashboards"
            />
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((dashboard) => {
            const Icon = icons[dashboard.icon];
            return (
              <Link key={dashboard.slug} href={`/${dashboard.slug}`} className="group outline-none">
                <Card className="h-full transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 group-focus-visible:ring-1 group-focus-visible:ring-zinc-500">
                  <CardHeader>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{dashboard.name}</CardTitle>
                    <CardDescription className="leading-6">{dashboard.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
