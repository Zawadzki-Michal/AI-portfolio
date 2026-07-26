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
    slug: "ip-whitelisting-terraform",
    title: "Moving IP whitelisting to Terraform",
    category: "azure",
    summary:
      "Part of a small team moving our Azure firewall rules from manual portal changes to something reviewable in Terraform.",
    details: [
      "Learned Terraform mostly by pairing on real allow-list changes with code review, instead of a tutorial.",
      "Still the newest person on most of these changes — a lot of it is asking questions and reading other people's PRs.",
    ],
    tags: ["azure", "terraform", "learning"],
  },
  {
    slug: "disaster-recovery-drills",
    title: "Disaster recovery drills",
    category: "azure",
    summary:
      "Taking part in failover drills for Azure workloads — the kind of thing that reads simple in a doc and is very different to actually run.",
    details: [
      "Shadowed drills first, then helped run later ones, seeing where the documentation and reality didn't quite match.",
      "Learning that DR is as much about process and communication as it is about Terraform.",
    ],
    tags: ["azure", "disaster-recovery", "learning"],
    relatedPostSlug: "2026-07-12-terraform-disaster-recovery",
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
