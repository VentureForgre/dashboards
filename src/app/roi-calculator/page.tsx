"use client";

import { FormEvent, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateROI, fmtCur, fmtPct } from "@/lib/roi-data";

export default function RoiCalculatorPage() {
  const [teamSize, setTeamSize] = useState(5);
  const [apiSpend, setApiSpend] = useState(500);
  const [hourlyValue, setHourlyValue] = useState(75);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [regulatedData, setRegulatedData] = useState(false);
  const [currentTool, setCurrentTool] = useState("ChatGPT Plus");
  const [status, setStatus] = useState("");

  const result = useMemo(
    () => calculateROI({ teamSize, apiSpend, hourlyValue, hoursPerWeek, regulatedData, currentTool }),
    [teamSize, apiSpend, hourlyValue, hoursPerWeek, regulatedData, currentTool]
  );

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Thanks. Your static report request has been captured in this session.");
    event.currentTarget.reset();
  }

  return (
    <DashboardShell title="Private LLM Hosting ROI Calculator" description="See how much your team could save by switching from third-party AI tools to private, secure LLM hosting.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tell us about your team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RangeControl label="Team Size" value={teamSize} min={1} max={100} onChange={setTeamSize} display={`${teamSize}`} />
            <RangeControl label="Monthly API Spend ($)" value={apiSpend} min={0} max={10000} step={50} onChange={setApiSpend} display={`$${apiSpend.toLocaleString()}`} />
            <RangeControl label="Hourly Value ($/hr)" value={hourlyValue} min={20} max={500} step={5} onChange={setHourlyValue} display={`$${hourlyValue}`} />
            <RangeControl label="AI Hours / Week" value={hoursPerWeek} min={1} max={80} onChange={setHoursPerWeek} display={`${hoursPerWeek} hrs`} />

            <div>
              <p className="mb-3 text-sm font-medium text-zinc-300">Do you handle regulated data? <span className="text-zinc-500">(HIPAA, GDPR, SOC 2, etc.)</span></p>
              <div className="flex gap-3">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setRegulatedData(value)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${regulatedData === value ? (value ? "border-red-500 bg-red-950/50 text-red-200" : "border-emerald-500 bg-emerald-950/50 text-emerald-200") : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"}`}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Current AI Tool</label>
              <Select value={currentTool} onValueChange={setCurrentTool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ChatGPT Plus">ChatGPT Plus</SelectItem>
                  <SelectItem value="OpenAI API">OpenAI API (pay-per-use)</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="Copilot">GitHub Copilot</SelectItem>
                  <SelectItem value="Other">Other / Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <Card className="border-blue-900/70 bg-blue-950/30">
            <CardContent className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-200">Recommended Tier</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-semibold">{result.tier.name}</h2>
                <span className="text-3xl font-bold">{fmtCur(result.tier.price)}<span className="text-base font-medium text-blue-200">/mo</span></span>
              </div>
              <p className="mt-2 text-sm text-blue-200">{result.tier.model} · {result.tier.users}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Metric label="Monthly Savings" value={fmtCur(result.monthlySavings)} />
            <Metric label="Annual Savings" value={fmtCur(result.annualSavings)} />
            <Metric label="Productivity Gain" value={fmtCur(result.productivityGain)} sub="per month" />
            <Metric label="ROI" value={fmtPct(result.roi)} valueClass="text-blue-300" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <LineItem label="Current Monthly Cost" value={fmtCur(result.currentCost)} />
              <LineItem label="Private Hosting Cost" value={fmtCur(result.hostingCost)} />
              <div className="border-t border-zinc-800 pt-3">
                <LineItem label="Net Monthly Savings" value={fmtCur(result.monthlySavings)} valueClass="text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className={result.compliance.color === "red" ? "border-red-900/70 bg-red-950/20" : "border-emerald-900/70 bg-emerald-950/20"}>
            <CardContent className="flex gap-3 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${result.compliance.color === "red" ? "bg-red-950 text-red-300" : "bg-emerald-950 text-emerald-300"}`}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">{result.compliance.level}</p>
                <p className="mt-1 text-sm text-zinc-400">{result.compliance.message}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Card className="mt-8">
        <CardContent className="mx-auto max-w-xl p-6 text-center">
          <h2 className="text-xl font-semibold">Get Your Detailed Report</h2>
          <p className="mt-2 text-sm text-zinc-400">Enter your email and we will prepare a personalized ROI breakdown with implementation recommendations.</p>
          <form onSubmit={submitEmail} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input type="email" name="email" required placeholder="you@company.com" />
            <input type="hidden" name="tier" value={`${result.tier.name} (${fmtCur(result.tier.price)}/mo)`} readOnly />
            <input type="hidden" name="monthlySavings" value={fmtCur(result.monthlySavings)} readOnly />
            <input type="hidden" name="annualSavings" value={fmtCur(result.annualSavings)} readOnly />
            <input type="hidden" name="roi" value={fmtPct(result.roi)} readOnly />
            <Button type="submit" className="shrink-0">Send My Report</Button>
          </form>
          {status ? <p className="mt-4 text-sm text-emerald-400">{status}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">We respect your privacy. No spam, ever.</p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function RangeControl({ label, value, display, min, max, step = 1, onChange }: { label: string; value: number; display: string; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-300">
        {label}
        <Badge variant="secondary">{display}</Badge>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(parseInt(event.target.value, 10))} />
      <div className="mt-1 flex justify-between text-xs text-zinc-500">
        <span>{min}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, valueClass = "text-zinc-100" }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${valueClass}`}>{value}</p>
        {sub ? <p className="text-xs text-zinc-500">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}

function LineItem({ label, value, valueClass = "text-zinc-100" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-400">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
