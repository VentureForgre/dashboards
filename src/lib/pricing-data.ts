export type UsageLevel = "Basic" | "Standard" | "Premium";

export type PricingTier = {
  name: string;
  minClinicians: number;
  maxClinicians: number;
  basePrice: number;
  features: string[];
};

export const tiers: PricingTier[] = [
  {
    name: "Solo",
    minClinicians: 1,
    maxClinicians: 1,
    basePrice: 250,
    features: [
      "Session note summarization",
      "Private LLM hosting",
      "Basic email support",
      "1 clinician seat",
      "HIPAA-aligned setup",
      "Monthly usage report"
    ]
  },
  {
    name: "Group",
    minClinicians: 2,
    maxClinicians: 10,
    basePrice: 750,
    features: [
      "All Solo features",
      "Up to 10 clinician seats",
      "Priority support",
      "Audit logging",
      "Team management dashboard",
      "Custom templates",
      "Data export tools",
      "API access"
    ]
  },
  {
    name: "Clinic",
    minClinicians: 11,
    maxClinicians: 25,
    basePrice: 2000,
    features: [
      "All Group features",
      "Up to 25 clinician seats",
      "24/7 dedicated support",
      "EHR integration",
      "Custom model fine-tuning",
      "SSO / SAML authentication",
      "Dedicated infrastructure",
      "Compliance consulting",
      "White-glove onboarding",
      "SLA guarantee"
    ]
  }
];

export const usageMultipliers: Record<UsageLevel, number> = {
  Basic: 1.0,
  Standard: 1.2,
  Premium: 1.5
};

export function getTier(numClinicians: number) {
  return tiers.find((tier) => numClinicians >= tier.minClinicians && numClinicians <= tier.maxClinicians) ?? tiers[tiers.length - 1];
}

export function calculatePrice(clinicians: number, usage: UsageLevel) {
  const tier = getTier(clinicians);
  const multiplier = usageMultipliers[usage];
  return {
    tier,
    multiplier,
    total: Math.round(tier.basePrice * multiplier),
    breakdown: `$${tier.basePrice} base x ${multiplier} (${usage})`
  };
}
