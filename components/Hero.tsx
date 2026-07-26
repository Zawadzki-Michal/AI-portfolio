import { StatusDot } from "./StatusDot";

const terminalLines = [
  { prompt: "$", text: "whoami" },
  { prompt: ">", text: "system engineer — azure / terraform / disaster recovery" },
  { prompt: "$", text: "cat focus.log" },
  { prompt: ">", text: "shipping AI-assisted infra tooling, one status update at a time" },
  { prompt: "$", text: "status --all" },
  { prompt: ">", text: "azure: operational · ai: operational · devops: operational" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
      <div className="grid gap-10 sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <div>
          <StatusDot label="build passing" />
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Infrastructure, monitored.
            <br />
            Knowledge, <span className="text-amber">shipped.</span>
          </h1>
          <p className="mt-6 max-w-md text-paper/70">
            A running log of Azure infrastructure, AI experimentation, and DevOps
            practice — written the way I work: in commits, PRs, and status
            updates.
          </p>
        </div>
        <div className="panel-card overflow-hidden font-mono text-sm shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F2A93B]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4FD1C5]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
            <span className="ml-2 text-paper/40">status.sh</span>
          </div>
          <div className="space-y-2 px-4 py-5">
            {terminalLines.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className={line.prompt === "$" ? "text-amber" : "text-teal"}>
                  {line.prompt}
                </span>
                <span className="text-paper/80">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
