"use client";

import type { FormEvent, InputHTMLAttributes } from "react";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { calculatePrice, type UsageLevel } from "@/lib/pricing-data";

const usageLevels: UsageLevel[] = ["Basic", "Standard", "Premium"];

export default function PricingCalculatorPage() {
  const [clinicians, setClinicians] = useState(1);
  const [usage, setUsage] = useState<UsageLevel>("Basic");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const quote = useMemo(() => calculatePrice(clinicians, usage), [clinicians, usage]);

  function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const practice = String(form.get("practice") || "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const subject = `Demo Request - ${practice || name} (${quote.tier.name} Tier)`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Practice: ${practice || "N/A"}`,
      `Clinicians: ${clinicians}`,
      `Selected Tier: ${quote.tier.name}`,
      `Usage Level: ${usage}`,
      "",
      "- Sent from AI Infra Agency Pricing Calculator"
    ].join("\n");

    setSent(true);
    window.location.href = `mailto:solomonwakhungu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <DashboardShell title="AI Infra Agency Pricing Calculator" description="Private LLM hosting for therapy practices. Find your plan in seconds.">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-7 p-6 sm:p-8">
          <div>
            <label className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Number of Clinicians
              <span className="text-2xl text-zinc-100">{clinicians}</span>
            </label>
            <input type="range" min={1} max={25} value={clinicians} onChange={(event) => setClinicians(parseInt(event.target.value, 10))} />
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Usage Level</p>
            <div className="grid grid-cols-3 gap-2">
              {usageLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUsage(level)}
                  className={`rounded-lg border p-3 text-center transition-colors ${usage === level ? "border-zinc-100 bg-zinc-100 text-zinc-950" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900"}`}
                >
                  <div className="text-sm font-semibold">{level}</div>
                  <div className="text-xs opacity-70">x{level === "Basic" ? "1.0" : level === "Standard" ? "1.2" : "1.5"}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center">
            <Badge>{quote.tier.name}</Badge>
            <div className="mt-3 text-5xl font-bold tracking-normal">
              <span className="text-2xl align-top">$</span>{quote.total.toLocaleString()}<span className="text-base font-medium text-zinc-400">/mo</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">{quote.breakdown}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Included Features</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {quote.tier.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (value) setSent(false); }}>
            <DialogTrigger asChild>
              <Button className="w-full">Book a Demo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book a Demo</DialogTitle>
                <DialogDescription>Send your details with the current quote attached.</DialogDescription>
              </DialogHeader>
              {sent ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950 text-emerald-300">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold">Request Sent</h3>
                  <p className="mt-1 text-sm text-zinc-400">We will be in touch within 24 hours to schedule your demo.</p>
                </div>
              ) : (
                <form onSubmit={submitDemo} className="space-y-4">
                  <Field label="Full Name *" name="name" placeholder="Jane Doe" required />
                  <Field label="Email Address *" name="email" type="email" placeholder="jane@practice.com" required />
                  <Field label="Practice Name" name="practice" placeholder="Healing Path Therapy" />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-300">Number of Clinicians</label>
                    <Input name="clinicians" type="number" value={clinicians} readOnly />
                  </div>
                  <Button type="submit" className="w-full">Request Demo</Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-300">{label}</label>
      <Input {...props} />
    </div>
  );
}
