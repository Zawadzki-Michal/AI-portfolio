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

export function getProjectSlugs(): string[] {
  return projectsData.map((p) => p.slug);
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  const data = projectsData.find((p) => p.slug === slug);
  if (!data) return undefined;
  const { content, ...base } = data;
  return { ...base, ...content[locale] };
}
