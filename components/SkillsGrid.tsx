const groups = [
  {
    category: "Azure",
    skills: ["Network design & IP whitelisting", "Terraform / IaC", "Disaster recovery & failover", "Cost & governance"],
  },
  {
    category: "AI",
    skills: ["Claude / LLM tooling", "Prompt & agent design", "Automation pipelines", "Content generation systems"],
  },
  {
    category: "DevOps",
    skills: ["GitHub Actions / CI-CD", "Infrastructure as code", "Release engineering", "Observability & monitoring"],
  },
];

export function SkillsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {groups.map((group) => (
        <div key={group.category} className="panel-card p-6">
          <h3 className="label-mono mb-4">{group.category}</h3>
          <ul className="flex flex-col gap-2">
            {group.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2 text-sm text-paper/80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
