import { StatusDot } from "./StatusDot";

const tiles = [
  {
    id: "azure",
    title: "Azure",
    description:
      "IP whitelisting, network design, Terraform-managed infrastructure, and disaster recovery playbooks running in production.",
    metric: "uptime 99.98%",
  },
  {
    id: "ai",
    title: "AI",
    description:
      "Applied LLM tooling — from Claude-powered automation to draft generation pipelines that turn signal into shipped content.",
    metric: "models: claude",
  },
  {
    id: "devops",
    title: "DevOps",
    description:
      "CI/CD, GitHub Actions, and infrastructure-as-code practices that make shipping boring — in the best way.",
    metric: "pipelines: green",
  },
];

export function ServiceTiles() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Monitoring tiles</h2>
        <span className="label-mono">3/3 operational</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.id} className="panel-card flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{tile.title}</h3>
              <StatusDot />
            </div>
            <p className="flex-1 text-sm text-paper/70">{tile.description}</p>
            <span className="label-mono">{tile.metric}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
