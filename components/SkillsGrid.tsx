import { useTranslations } from "next-intl";

export function SkillsGrid() {
  const t = useTranslations("skills");

  const groups = [
    { category: t("azureCategory"), skills: t.raw("azureSkills") as string[] },
    { category: t("aiCategory"), skills: t.raw("aiSkills") as string[] },
    { category: t("devopsCategory"), skills: t.raw("devopsSkills") as string[] },
  ];

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
