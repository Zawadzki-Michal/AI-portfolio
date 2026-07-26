import type { Locale } from "@/i18n/routing";

type ProjectContent = {
  title: string;
  summary: string;
  details: string[];
};

export type Project = ProjectContent & {
  slug: string;
  category: "azure" | "ai" | "devops";
  tags: string[];
  relatedPostSlug?: string;
};

type ProjectData = {
  slug: string;
  category: "azure" | "ai" | "devops";
  tags: string[];
  relatedPostSlug?: string;
  content: Record<Locale, ProjectContent>;
};

const projectsData: ProjectData[] = [
  {
    slug: "ip-whitelisting-terraform",
    category: "azure",
    tags: ["azure", "terraform", "learning"],
    content: {
      en: {
        title: "Moving IP whitelisting to Terraform",
        summary:
          "Part of a small team moving our Azure firewall rules from manual portal changes to something reviewable in Terraform.",
        details: [
          "Learned Terraform mostly by pairing on real allow-list changes with code review, instead of a tutorial.",
          "Still the newest person on most of these changes — a lot of it is asking questions and reading other people's PRs.",
        ],
      },
      pl: {
        title: "Przenoszenie whitelistingu IP do Terraforma",
        summary:
          "Część małego zespołu, który przenosi reguły firewalla Azure z ręcznych zmian w portalu na coś, co można zrecenzować w Terraformie.",
        details: [
          "Terraforma nauczyłem się głównie przez pairing przy prawdziwych zmianach allow-list z code review, zamiast tutoriala.",
          "Wciąż jestem najnowszą osobą przy większości tych zmian — dużo z tego to zadawanie pytań i czytanie cudzych PR-ów.",
        ],
      },
    },
  },
  {
    slug: "disaster-recovery-drills",
    category: "azure",
    tags: ["azure", "disaster-recovery", "learning"],
    relatedPostSlug: "2026-07-12-terraform-disaster-recovery",
    content: {
      en: {
        title: "Disaster recovery drills",
        summary:
          "Taking part in failover drills for Azure workloads — the kind of thing that reads simple in a doc and is very different to actually run.",
        details: [
          "Shadowed drills first, then helped run later ones, seeing where the documentation and reality didn't quite match.",
          "Learning that DR is as much about process and communication as it is about Terraform.",
        ],
      },
      pl: {
        title: "Ćwiczenia disaster recovery",
        summary:
          "Udział w ćwiczeniach failover dla obciążeń Azure — coś, co w dokumentacji brzmi prosto, a w praktyce wygląda zupełnie inaczej.",
        details: [
          "Najpierw obserwowałem ćwiczenia, potem pomagałem prowadzić kolejne, widząc, gdzie dokumentacja rozjeżdża się z rzeczywistością.",
          "Uczę się, że DR to w takim samym stopniu proces i komunikacja, co Terraform.",
        ],
      },
    },
  },
  {
    slug: "personal-brand-pipeline",
    category: "ai",
    tags: ["ai", "devops", "automation", "linkedin"],
    relatedPostSlug: "2026-07-26-personal-brand-automation",
    content: {
      en: {
        title: "This site: an AI-automated personal brand pipeline",
        summary:
          "Merge a Markdown post to main and it deploys, then publishes itself to LinkedIn with a link back — no manual copy-paste step.",
        details: [
          "Claude drafts candidate posts from RSS sources on a schedule and opens a PR for review.",
          "A GitHub Action waits for the Vercel deploy to go live, then publishes to LinkedIn via the official REST API.",
        ],
      },
      pl: {
        title: "Ta strona: pipeline personal brandu zautomatyzowany przez AI",
        summary:
          "Merge posta w Markdown do main uruchamia deploy, a strona sama publikuje się na LinkedIn z linkiem zwrotnym — bez ręcznego kopiowania i wklejania.",
        details: [
          "Claude szkicuje kandydatów na posty na podstawie źródeł RSS według harmonogramu i otwiera PR do recenzji.",
          "GitHub Action czeka, aż deploy na Vercel się zakończy, a potem publikuje na LinkedIn przez oficjalne REST API.",
        ],
      },
    },
  },
];

export function getProjects(locale: Locale): Project[] {
  return projectsData.map(({ content, ...base }) => ({ ...base, ...content[locale] }));
}
