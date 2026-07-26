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
    relatedPostSlug: "2026-07-26-lifeos-self-hosted-assistant",
    content: {
      en: {
        title: "LifeOS — a self-hosted AI assistant",
        summary:
          "A personal AI assistant I'm building for myself: a FastAPI backend behind a Telegram bot and a small React web app, routing between a local Ollama model and OpenRouter depending on the task.",
        details: [
          "Handles goals, calendar, and budget tracking through conversation, with voice input/output and Google Calendar integration.",
          "Self-hosted on a k3s cluster on Oracle Cloud, Terraform-provisioned with CI/CD deploying on every push to main — started as a WSL2 box at home, now kept running as a cold-standby rollback instead of being torn down.",
        ],
      },
      pl: {
        title: "LifeOS — samodzielnie hostowany asystent AI",
        summary:
          "Osobisty asystent AI, który buduję dla siebie: backend w FastAPI za botem na Telegramie i małą aplikacją webową w React, przełączający się między lokalnym modelem Ollama a OpenRouter w zależności od zadania.",
        details: [
          "Obsługuje cele, kalendarz i budżet przez rozmowę, z wejściem/wyjściem głosowym i integracją z Google Calendar.",
          "Samodzielnie hostowany na klastrze k3s w Oracle Cloud, przygotowanym w Terraformie, z CI/CD wdrażającym przy każdym pushu do main — zaczęło się jako skrzynka WSL2 w domu, teraz działa jako cold-standby na wypadek rollbacku, zamiast być wyłączona.",
        ],
      },
    },
  },
  {
    slug: "small-business-booking-assistant",
    category: "ai",
    tags: ["ai", "automation", "self-hosted"],
    relatedPostSlug: "2026-07-26-small-business-sms-gateway",
    content: {
      en: {
        title: "AI-assisted booking system for a small service business",
        summary:
          "A client management and scheduling tool I built for someone close to me who runs a one-person, appointment-based business — natural-language input instead of forms, on top of a self-hosted stack.",
        details: [
          "Two-way SMS reminders through a self-hosted gateway running on an actual Android phone's SIM card, instead of a paid per-message API.",
          "An AI chat assistant running on a local model, so client names and notes never leave the machine — the harder part was getting tool-calling reliable enough to trust with real bookings.",
          "A GitHub Actions pipeline runs the backend test suite against a disposable Postgres database on every push, since a bug here affects someone else's actual income.",
        ],
      },
      pl: {
        title: "System rezerwacji z AI dla małej firmy usługowej",
        summary:
          "Narzędzie do zarządzania klientami i kalendarzem, które zbudowałem dla kogoś bliskiego, kto prowadzi jednoosobową firmę usługową — wprowadzanie danych językiem naturalnym zamiast formularzy, na bazie samodzielnie hostowanego stacku.",
        details: [
          "Dwukierunkowe SMS-y z przypomnieniami przez samodzielnie hostowaną bramkę działającą na karcie SIM w prawdziwym telefonie Android, a nie płatne API rozliczane za wiadomość.",
          "Asystent AI oparty na lokalnym modelu, żeby dane klientów nigdy nie wychodziły poza maszynę — trudniejsze niż oczekiwałem było uzyskanie tool-callingu wystarczająco pewnego, by ufać mu przy prawdziwych rezerwacjach.",
          "Pipeline w GitHub Actions odpala zestaw testów backendu na jednorazowej bazie Postgres przy każdym pushu, bo bug tutaj wpływa na prawdziwy dochód kogoś innego.",
        ],
      },
    },
  },
];

export function getProjects(locale: Locale): Project[] {
  return projectsData.map(({ content, ...base }) => ({ ...base, ...content[locale] }));
}
