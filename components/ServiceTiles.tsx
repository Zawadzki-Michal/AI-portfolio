import { StatusDot } from "./StatusDot";

const tiles = [
  {
    id: "azure",
    title: "Azure",
    description:
      "The stuff I actually touch day to day: IP whitelisting, network design, Terraform, disaster recovery drills — still learning the edges of all of it.",
    metric: "2 years in",
  },
  {
    id: "ai",
    title: "AI",
    description:
      "Experimenting with Claude and LLM tooling. This site's own posting pipeline is the biggest thing I've built with it so far.",
    metric: "models: claude",
  },
  {
    id: "devops",
    title: "DevOps",
    description:
      "CI/CD, GitHub Actions, infrastructure-as-code — trying to make shipping less scary, one pipeline at a time.",
    metric: "learning by doing",
  },
];

export function ServiceTiles() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Monitoring tiles</h2>
        <span className="label-mono">3/3 in progress</span>
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
