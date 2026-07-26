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
          "A lot of it comes down to careful review and testing changes before they touch production.",
        ],
      },
      pl: {
        title: "Przenoszenie whitelistingu IP do Terraforma",
        summary:
          "Część małego zespołu, który przenosi reguły firewalla Azure z ręcznych zmian w portalu na coś, co można zrecenzować w Terraformie.",
        details: [
          "Terraforma nauczyłem się głównie przez pairing przy prawdziwych zmianach allow-list z code review, zamiast tutoriala.",
          "Dużo z tego to dokładny przegląd i testowanie zmian, zanim trafią na produkcję.",
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
    slug: "automated-publish-pipeline",
    category: "devops",
    tags: ["devops", "automation", "linkedin", "ci-cd"],
    relatedPostSlug: "2026-07-26-personal-brand-automation",
    content: {
      en: {
        title: "Automated publish pipeline for this site",
        summary:
          "Merge a Markdown post to main and it deploys, then publishes itself to LinkedIn with a link back — no manual copy-paste step.",
        details: [
          "GitHub Actions handles the full flow: build, deploy, wait for the live URL, then publish to LinkedIn via the official REST API.",
          "Everything is versioned and reviewed through a normal pull request, same as any other change to the site.",
        ],
      },
      pl: {
        title: "Automatyczny pipeline publikacji dla tej strony",
        summary:
          "Merge posta w Markdown do main uruchamia deploy, a strona sama publikuje się na LinkedIn z linkiem zwrotnym — bez ręcznego kopiowania i wklejania.",
        details: [
          "GitHub Actions ogarnia cały flow: build, deploy, czekanie na żywy URL, a potem publikację na LinkedIn przez oficjalne REST API.",
          "Wszystko jest wersjonowane i przechodzi normalny pull request, tak jak każda inna zmiana na tej stronie.",
        ],
      },
    },
  },
  {
    slug: "lifeos",
    category: "ai",
    tags: ["ai", "llm", "self-hosted", "automation"],
    content: {
      en: {
        title: "LifeOS — a self-hosted AI assistant",
        summary:
          "A personal AI assistant I'm building for myself: a FastAPI backend behind a Telegram bot and a small React web app, routing between a local Ollama model and OpenRouter depending on the task.",
        details: [
          "Handles goals, calendar, and budget tracking through conversation, with voice input/output and Google Calendar integration.",
          "Self-hosted on a small k3s cluster with Grafana/Prometheus dashboards tracking LLM latency and API spend — half the project has been learning to run infrastructure for something I actually use daily.",
        ],
      },
      pl: {
        title: "LifeOS — samodzielnie hostowany asystent AI",
        summary:
          "Osobisty asystent AI, który buduję dla siebie: backend w FastAPI za botem na Telegramie i małą aplikacją webową w React, przełączający się między lokalnym modelem Ollama a OpenRouter w zależności od zadania.",
        details: [
          "Obsługuje cele, kalendarz i budżet przez rozmowę, z wejściem/wyjściem głosowym i integracją z Google Calendar.",
          "Samodzielnie hostowany na małym klastrze k3s z dashboardami Grafana/Prometheus śledzącymi opóźnienia LLM i wydatki na API — połowa tego projektu to nauka utrzymywania infrastruktury dla czegoś, czego faktycznie używam codziennie.",
        ],
      },
    },
  },
];

export function getProjects(locale: Locale): Project[] {
  return projectsData.map(({ content, ...base }) => ({ ...base, ...content[locale] }));
}
