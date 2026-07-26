export type Project = {
  slug: string;
  title: string;
  category: "azure" | "ai" | "devops";
  summary: string;
  details: string[];
  tags: string[];
  relatedPostSlug?: string;
};

export const projects: Project[] = [
  {
    slug: "azure-disaster-recovery",
    title: "Terraform-managed Azure disaster recovery",
    category: "azure",
    summary:
      "DR runbooks and failover procedures for production Azure workloads, provisioned as code and tested against real failure scenarios.",
    details: [
      "Region failover automated through Terraform, including IP whitelisting rules mirrored ahead of time to the DR region.",
      "Runbooks written and executed as drills, not left as documentation nobody has run.",
    ],
    tags: ["azure", "terraform", "disaster-recovery"],
    relatedPostSlug: "2026-07-12-terraform-disaster-recovery",
  },
  {
    slug: "ip-whitelisting-automation",
    title: "IP whitelisting at scale",
    category: "azure",
    summary:
      "Replaced manual firewall rule management with a Terraform-driven pipeline covering dozens of Azure services and environments.",
    details: [
      "Single source of truth for allow-lists, reviewed via PR instead of portal changes.",
      "Drift detection to catch manual changes before they become incidents.",
    ],
    tags: ["azure", "terraform", "networking"],
  },
  {
    slug: "personal-brand-pipeline",
    title: "This site: an AI-automated personal brand pipeline",
    category: "ai",
    summary:
      "Merge a Markdown post to main and it deploys, then publishes itself to LinkedIn with a link back — no manual copy-paste step.",
    details: [
      "Claude drafts candidate posts from RSS sources on a schedule and opens a PR for review.",
      "A GitHub Action waits for the Vercel deploy to go live, then publishes to LinkedIn via the official REST API.",
    ],
    tags: ["ai", "devops", "automation", "linkedin"],
    relatedPostSlug: "2026-07-26-personal-brand-automation",
  },
];
