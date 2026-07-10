export type RoiInputs = {
  teamSize: number;
  apiSpend: number;
  hourlyValue: number;
  hoursPerWeek: number;
  regulatedData: boolean;
  currentTool: string;
};

export const roiTiers = [
  { name: "Starter", price: 250, model: "Small Model", users: "5 users", maxUsers: 5 },
  { name: "Professional", price: 750, model: "Larger Model", users: "10 users", maxUsers: 10 },
  { name: "Business", price: 1500, model: "Advanced Model", users: "25 users", maxUsers: 25 },
  { name: "Enterprise", price: 3000, model: "Dedicated Cluster", users: "Unlimited users", maxUsers: Infinity }
];

function recommendedTier(teamSize: number, regulatedData: boolean) {
  if (regulatedData && teamSize > 10) return roiTiers[3];
  if (teamSize <= 5) return roiTiers[0];
  if (teamSize <= 10) return roiTiers[1];
  if (teamSize <= 25) return roiTiers[2];
  return roiTiers[3];
}

export function calculateROI(inputs: RoiInputs) {
  const tier = recommendedTier(inputs.teamSize, inputs.regulatedData);
  const perSeatToolCost = inputs.currentTool === "ChatGPT Plus" ? inputs.teamSize * 20 : inputs.currentTool === "Copilot" ? inputs.teamSize * 19 : 0;
  const currentCost = inputs.apiSpend + perSeatToolCost;
  const hostingCost = tier.price;
  const productivityGain = inputs.teamSize * inputs.hoursPerWeek * 4.33 * inputs.hourlyValue * 0.25;
  const monthlySavings = currentCost + productivityGain - hostingCost;
  const annualSavings = monthlySavings * 12;
  const roi = hostingCost > 0 ? (monthlySavings / hostingCost) * 100 : Infinity;

  return {
    tier,
    currentCost,
    hostingCost,
    productivityGain,
    monthlySavings,
    annualSavings,
    roi,
    compliance: inputs.regulatedData
      ? {
          level: "High Risk Reduced",
          color: "red" as const,
          message: "Private hosting helps reduce third-party exposure for regulated data workflows."
        }
      : {
          level: "Low Compliance Risk",
          color: "green" as const,
          message: "Your current usage profile has lower regulated-data exposure."
        }
  };
}

export function fmtCur(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(v);
}

export function fmtPct(v: number) {
  if (!Number.isFinite(v)) return "infinity";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(v / 100);
}
