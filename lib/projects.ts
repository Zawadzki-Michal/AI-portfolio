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
    content: {
      en: {
        title: "LifeOS — a self-hosted AI assistant",
        summary:
          "A personal AI assistant I'm building for myself: a FastAPI backend behind a Telegram bot and a small React web app, routing between a local Ollama model and OpenRouter depending on the task.",
        details: [
          "Handles goals, calendar, and budget tracking through conversation, with voice input/output and Google Calendar integration.",
          "Self-hosted on a k3s cluster on Oracle Cloud, Terraform-provisioned with CI/CD deploying on every push to main — started as a WSL2 box at home, now kept running as a cold-standby rollback instead of being torn down.",
          "Custom domain (lifeos.michalzawadzki.dev) backed by a Terraform-managed Cloudflare DNS record — imported from a hand-created one into IaC rather than left undocumented, DNS-only/unproxied so cert-manager's HTTP-01 challenge and the app's SSE/voice streaming don't pick up an extra proxying layer.",
          "Routes per-request, not per-conversation: a local Ollama model handles transactional tool-calling (expenses, calendar, health logs), and a purpose-built redaction gateway strips household names before anything genuinely open-ended gets handed off to a cloud model.",
          "90 pytest tests and GitHub Actions CI cover the tool-dispatch table, the finance/calendar/health clients (mocked against real API responses), and the full session API — caught real bugs before they shipped, including a units mismatch that inflated a day's tracked calories by 7x.",
          "Health data syncs itself: an iPhone automation (Health Auto Export) pushes a JSON payload to a bearer-token-gated endpoint whenever new data lands, parsed into daily metrics and workouts so the model can pull it into a morning/evening brief or answer \"how was my week\" on demand — no manual export step.",
          "Security is scoped deliberately, not bolted on: Google OAuth behind an email allow-list with a signed session cookie, a constant-time bearer-token check gating the one webhook exposed on the public tunnel (the health sync endpoint above), a redaction gateway with its own test suite, and the DB admin UI (Adminer) bound to localhost only, never routed through the tunnel.",
        ],
      },
      pl: {
        title: "LifeOS — samodzielnie hostowany asystent AI",
        summary:
          "Osobisty asystent AI, który buduję dla siebie: backend w FastAPI za botem na Telegramie i małą aplikacją webową w React, przełączający się między lokalnym modelem Ollama a OpenRouter w zależności od zadania.",
        details: [
          "Obsługuje cele, kalendarz i budżet przez rozmowę, z wejściem/wyjściem głosowym i integracją z Google Calendar.",
          "Samodzielnie hostowany na klastrze k3s w Oracle Cloud, przygotowanym w Terraformie, z CI/CD wdrażającym przy każdym pushu do main — zaczęło się jako skrzynka WSL2 w domu, teraz działa jako cold-standby na wypadek rollbacku, zamiast być wyłączona.",
          "Własna domena (lifeos.michalzawadzki.dev) oparta na rekordzie DNS w Cloudflare zarządzanym przez Terraform — zaimportowanym z ręcznie utworzonego wpisu do IaC zamiast zostawiać go nieudokumentowanym, DNS-only/bez proxy, żeby wyzwanie HTTP-01 cert-managera i streaming SSE/głosowy aplikacji nie przechodziły przez dodatkową warstwę proxy.",
          "Wybiera model per żądanie, nie per rozmowa: lokalny model Ollama obsługuje transakcyjne wywołania narzędzi (wydatki, kalendarz, wpisy zdrowotne), a zbudowana od zera bramka anonimizacji usuwa imiona domowników, zanim cokolwiek naprawdę otwartego trafi do modelu w chmurze.",
          "90 testów pytest i CI w GitHub Actions pokrywają tabelę wywołań narzędzi, klientów finansów/kalendarza/zdrowia (mockowanych na realnych odpowiedziach API) i cały interfejs sesji — złapały prawdziwe błędy zanim trafiły na produkcję, w tym pomyłkę w jednostkach, która zawyżyła dzienny licznik kalorii siedmiokrotnie.",
          "Dane zdrowotne synchronizują się same: automatyzacja na iPhonie (Health Auto Export) wysyła payload JSON do endpointu zabezpieczonego tokenem bearer za każdym razem, gdy pojawią się nowe dane, sparsowane do dziennych metryk i treningów, żeby model mógł je wykorzystać w porannym/wieczornym podsumowaniu albo odpowiedzieć na pytanie \"jak minął tydzień\" — bez ręcznego eksportu.",
          "Bezpieczeństwo jest świadomie zawężone, nie doklejone na końcu: Google OAuth za allow-listą e-maili z podpisanym ciasteczkiem sesji, porównanie tokena bearer w czasie stałym zabezpieczające jedyny webhook wystawiony publicznie przez tunel (endpoint synchronizacji zdrowia powyżej), bramka anonimizacji z własnym zestawem testów oraz UI administracyjne bazy (Adminer) związane wyłącznie z localhost, nigdy nie routowane przez tunel.",
        ],
      },
    },
  },
  {
    slug: "small-business-booking-assistant",
    category: "ai",
    tags: ["ai", "automation", "self-hosted"],
    content: {
      en: {
        title: "AI-assisted booking system for a small service business",
        summary:
          "A client management and scheduling tool I built for someone close to me who runs a one-person, appointment-based business — natural-language input instead of forms, on top of a self-hosted stack.",
        details: [
          "Two-way SMS reminders through a self-hosted gateway running on an actual Android phone's SIM card, instead of a paid per-message API.",
          "An AI chat assistant running on a local model, so client names and notes never leave the machine — the harder part was getting tool-calling reliable enough to trust with real bookings.",
          "A GitHub Actions pipeline runs the backend test suite against a disposable Postgres database on every push, since a bug here affects someone else's actual income.",
          "Beyond bookings — client documents with an on-canvas signature saved as a generated PDF, and a business finance view (revenue, costs, per-period totals) kept entirely separate from the owner's personal budget.",
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
          "Poza rezerwacjami — dokumenty klientki z podpisem na canvasie zapisywanym jako wygenerowany PDF oraz widok finansów biznesowych (przychody, koszty, sumy okresowe) całkowicie osobny od prywatnego budżetu właścicielki.",
        ],
      },
    },
  },
  {
    slug: "automated-publish-pipeline",
    category: "devops",
    tags: ["devops", "automation", "ci-cd", "linkedin"],
    content: {
      en: {
        title: "This site's own publish pipeline",
        summary:
          "Merge a Markdown post to main and it deploys, then publishes itself to LinkedIn with a link back — no manual copy-paste step.",
        details: [
          "GitHub Actions handles the full flow: build, deploy, wait for the live URL, then publish to LinkedIn via the official REST API.",
          "The deploy check used to just poll for a 200 — which would pass even against a stale cached page. It now also confirms the actual post title is present in the response body before publishing goes ahead, with unit tests covering that logic so it can't silently regress.",
          "Everything is versioned and reviewed through a normal pull request, same as any other change to the site — CI runs typecheck, the full unit test suite, and a production build on every push.",
          "A weekly scheduled job pulls from a handful of RSS feeds, drafts a bilingual post with an LLM against a fixed voice/style prompt, and opens a PR — nothing publishes without a human reading it first.",
          "A GitHub OAuth-gated admin panel gives a manual path alongside the automated one — writing and editing posts directly, and moderating comments — without needing a PR for every small fix.",
          "The site itself is now properly discoverable: JSON-LD structured data, dynamically generated OG images per post, sitemap/robots.txt, and canonical/hreflang tags across both locales; a public RSS feed and Vercel Web Analytics track who's actually reading.",
          "Reader-facing polish followed the same pipeline discipline — a light/dark theme (recolored via CSS variables, not per-component), a reading-progress bar, tag-scored related posts, and a full tags index, all shipped through the same PR + CI review as everything else.",
        ],
      },
      pl: {
        title: "Własny pipeline publikacji tej strony",
        summary:
          "Merge posta w Markdown do main uruchamia deploy, a strona sama publikuje się na LinkedIn z linkiem zwrotnym — bez ręcznego kopiowania i wklejania.",
        details: [
          "GitHub Actions ogarnia cały flow: build, deploy, czekanie na żywy URL, a potem publikację na LinkedIn przez oficjalne REST API.",
          "Sprawdzanie deployu wcześniej tylko odpytywało o status 200 — co przechodziłoby nawet dla nieodświeżonego cache'a. Teraz dodatkowo potwierdza, że tytuł posta faktycznie pojawia się w treści odpowiedzi, zanim publikacja ruszy dalej, z testami jednostkowymi pilnującymi tej logiki.",
          "Wszystko jest wersjonowane i przechodzi normalny pull request, tak jak każda inna zmiana na tej stronie — CI odpala typecheck, pełny zestaw testów jednostkowych i produkcyjny build przy każdym pushu.",
          "Cotygodniowe zadanie pobiera kilka kanałów RSS, tworzy dwujęzycznego draft posta modelem LLM według ustalonego promptu stylu/głosu i otwiera PR — nic nie publikuje się bez wcześniejszego przeczytania przez człowieka.",
          "Panel administracyjny, zablokowany logowaniem przez GitHub OAuth, daje ręczną ścieżkę obok automatycznej — pisanie i edytowanie postów wprost, a także moderację komentarzy — bez PR-a przy każdej drobnej poprawce.",
          "Sama strona jest teraz porządnie wykrywalna: dane strukturalne JSON-LD, dynamicznie generowane obrazki OG dla każdego posta, sitemap.xml/robots.txt oraz tagi canonical/hreflang w obu językach; publiczny kanał RSS i Vercel Web Analytics pokazują, kto faktycznie czyta.",
          "Udogodnienia dla czytelników poszły tą samą ścieżką co reszta pipeline'u — jasny/ciemny motyw (przekolorowany przez zmienne CSS, nie komponent po komponencie), pasek postępu czytania, powiązane wpisy dobierane po wspólnych tagach i pełny indeks tagów — wszystko wdrożone przez ten sam PR + CI, co każda inna zmiana na stronie.",
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
