# Dashboards

Centralized dashboards hub hosted at **dashboards.sullylab.de**.

## Dashboards

- `/debt-payoff` - Debt payoff timeline, avalanche vs snowball, freelance income slider
- `/roi-calculator` - Private LLM hosting ROI calculator
- `/pricing-calculator` - Agency pricing calculator with Book a Demo CTA
- `/youtube-analytics` - Wait What Daily YouTube channel analytics

## Tech Stack

- Next.js 14 (static export)
- Tailwind CSS
- shadcn/ui components
- Chart.js (react-chartjs-2)

## Development

```bash
npm install
npm run dev      # dev server at localhost:3000
npm run build    # static export to ./out
```

## Deployment

Deployed to the K8s cluster via Flux GitOps. See `deploy/homelab/` for Kubernetes manifests.

- **Domain:** dashboards.sullylab.de
- **Image:** ghcr.io/ventureforgre/dashboards:main
- **Registry:** GitHub Container Registry (GHCR)

## Adding New Dashboards

1. Create a new page at `src/app/<dashboard-slug>/page.tsx`
2. Add dashboard metadata to `src/lib/dashboards.ts`
3. It automatically appears on the home page search and card grid
