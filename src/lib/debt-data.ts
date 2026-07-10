export type Debt = {
  name: string;
  balance: number;
  apr: number;
  min_pct: number;
  min_floor: number;
};

export const debts: Debt[] = [
  { name: "Amex Business", balance: 17972.0, apr: 0.3, min_pct: 0.03, min_floor: 25.0 },
  { name: "Capital One", balance: 18643.0, apr: 0.25, min_pct: 0.03, min_floor: 25.0 },
  { name: "BofA", balance: 2787.0, apr: 0.0, min_pct: 0.03, min_floor: 25.0 },
  { name: "Loans", balance: 7859.0, apr: 0.0, min_pct: 0.03, min_floor: 25.0 }
];

export const biweeklyIncome = 3888;
export const survivalBudget = 1013;
export const baseMonthlyIncome = (biweeklyIncome * 26) / 12;

export function minPayment(debt: Debt) {
  return Math.max(debt.balance * debt.min_pct, debt.min_floor);
}

export function calculatePayoff(extraPayment: number, freelanceIncome: number) {
  const localDebts = debts.map((d) => ({ ...d }));
  const monthlyAvailable = baseMonthlyIncome - survivalBudget + freelanceIncome + extraPayment;
  let totalInterest = 0;
  const timeline = [{ month: 0, totalBalance: localDebts.reduce((s, d) => s + d.balance, 0) }];
  const payoffMonths: Record<string, number> = {};

  let month = 0;
  const maxMonths = 240;

  while (localDebts.some((d) => d.balance > 0.01) && month < maxMonths) {
    month++;
    let remainingBudget = monthlyAvailable;

    for (const d of localDebts) {
      if (d.balance > 0) {
        const interest = d.balance * (d.apr / 12);
        d.balance += interest;
        totalInterest += interest;
      }
    }

    for (const d of localDebts) {
      if (d.balance > 0) {
        const mp = Math.min(minPayment(d), d.balance);
        d.balance -= mp;
        remainingBudget -= mp;
      }
    }

    const sortedDebts = [...localDebts].filter((d) => d.balance > 0).sort((a, b) => b.apr - a.apr);
    for (const d of sortedDebts) {
      if (remainingBudget <= 0) break;
      const payment = Math.min(remainingBudget, d.balance);
      d.balance -= payment;
      remainingBudget -= payment;
      if (d.balance <= 0.01) {
        payoffMonths[d.name] = month;
      }
    }

    const totalBalance = localDebts.reduce((s, d) => s + Math.max(0, d.balance), 0);
    timeline.push({ month, totalBalance });
  }

  for (const d of localDebts) {
    if (d.balance <= 0.01 && !payoffMonths[d.name]) {
      payoffMonths[d.name] = month;
    }
  }

  return {
    timeline,
    totalInterest,
    monthsToFreedom: month,
    payoffMonths,
    remainingDebts: localDebts
  };
}

export function formatDebtDate(monthsFromNow: number) {
  const date = new Date(2026, 6, 1);
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export function formatCurrency(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
