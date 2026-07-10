"use client";

import { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseMonthlyIncome, calculatePayoff, debts, formatCurrency, formatDebtDate, minPayment, survivalBudget } from "@/lib/debt-data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

export default function DebtPayoffPage() {
  const [extraPayment, setExtraPayment] = useState(0);
  const [freelanceIncome, setFreelanceIncome] = useState(0);
  const result = useMemo(() => calculatePayoff(extraPayment, freelanceIncome), [extraPayment, freelanceIncome]);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const currentMonthlyInterest = debts.reduce((sum, debt) => sum + debt.balance * (debt.apr / 12), 0);
  const sortedDebts = [...debts].sort((a, b) => b.apr - a.apr);
  let remainingBudget = baseMonthlyIncome - survivalBudget + freelanceIncome + extraPayment;
  sortedDebts.forEach((debt) => {
    remainingBudget -= minPayment(debt);
  });

  return (
    <DashboardShell title="Debt Annihilation Dashboard" description="Solomon Wakhungu | Starting July 2026">
      <section className="mb-6 rounded-lg border border-sky-900/80 bg-zinc-900 p-6 text-center">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">Debt-Free Date</div>
        <div className="mt-1 text-3xl font-semibold text-emerald-400">{formatDebtDate(result.monthsToFreedom)}</div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Debt" value={formatCurrency(totalDebt)} valueClass="text-red-400" />
        <MetricCard label="Monthly Interest" value={formatCurrency(currentMonthlyInterest)} valueClass="text-orange-400" />
        <MetricCard label="Total Interest to Pay" value={formatCurrency(result.totalInterest)} valueClass="text-emerald-400" />
        <MetricCard label="Months to Freedom" value={`${result.monthsToFreedom} months`} valueClass="text-green-400" />
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <SliderCard label="Extra Monthly Payment" value={extraPayment} max={3000} step={50} onChange={setExtraPayment} />
        <SliderCard label="Freelance Income (Monthly)" value={freelanceIncome} max={5000} step={100} onChange={setFreelanceIncome} />
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-sky-300">Payoff Timeline (Avalanche)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Line
              data={{
                labels: result.timeline.map((point) => `Month ${point.month}`),
                datasets: [
                  {
                    label: "Total Debt",
                    data: result.timeline.map((point) => Math.round(point.totalBalance)),
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                  }
                ]
              }}
              options={chartOptions}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-sky-300">Per-Debt Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Bar
              data={{
                labels: debts.map((debt) => debt.name),
                datasets: [
                  {
                    label: "Starting Balance",
                    data: debts.map((debt) => debt.balance),
                    backgroundColor: "#f87171",
                    borderRadius: 4,
                    yAxisID: "y"
                  },
                  {
                    label: "Payoff Month",
                    data: debts.map((debt) => result.payoffMonths[debt.name] || 0),
                    backgroundColor: "#4ade80",
                    borderRadius: 4,
                    yAxisID: "y1"
                  }
                ]
              }}
              options={barOptions}
            />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-sky-300">Monthly Payment Targets (Avalanche)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Debt</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>APR</TableHead>
                <TableHead>Min Payment</TableHead>
                <TableHead>Avalanche Payment</TableHead>
                <TableHead>Payoff Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDebts.map((debt) => {
                const mp = minPayment(debt);
                const avalanchePayment = debt.apr === sortedDebts[0].apr ? mp + remainingBudget : mp;
                return (
                  <TableRow key={debt.name}>
                    <TableCell className="font-medium text-zinc-100">{debt.name}</TableCell>
                    <TableCell>{formatCurrency(debt.balance)}</TableCell>
                    <TableCell className="text-red-400">{(debt.apr * 100).toFixed(0)}%</TableCell>
                    <TableCell>{formatCurrency(mp)}</TableCell>
                    <TableCell className="text-emerald-400">{formatCurrency(avalanchePayment)}</TableCell>
                    <TableCell>{result.payoffMonths[debt.name] ? formatDebtDate(result.payoffMonths[debt.name]) : "--"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function MetricCard({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function SliderCard({ label, value, max, step, onChange }: { label: string; value: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <Card>
      <CardContent className="p-5">
        <label className="mb-3 flex items-center justify-between text-sm text-zinc-400">
          {label}
          <span className="text-base font-semibold text-sky-300">{formatCurrency(value)}</span>
        </label>
        <input type="range" min={0} max={max} step={step} value={value} onChange={(event) => onChange(parseInt(event.target.value, 10))} />
      </CardContent>
    </Card>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#94a3b8", callback: (value: string | number) => `$${Number(value) / 1000}k` },
      grid: { color: "#334155" }
    },
    x: {
      ticks: { color: "#94a3b8", maxTicksLimit: 10 },
      grid: { color: "#334155" }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#94a3b8", callback: (value: string | number) => `$${Number(value) / 1000}k` },
      grid: { color: "#334155" }
    },
    y1: {
      position: "right" as const,
      beginAtZero: true,
      ticks: { color: "#94a3b8", callback: (value: string | number) => `${value} mo` },
      grid: { display: false }
    },
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "#334155" }
    }
  },
  plugins: {
    legend: { labels: { color: "#e2e8f0" } }
  }
};
