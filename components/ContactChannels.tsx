import { siteConfig } from "@/lib/site-config";

type Channel = {
  label: string;
  href: string | null;
  value: string;
};

function buildChannels(): Channel[] {
  const { email, social } = siteConfig;

  return [
    { label: "email", href: `mailto:${email}`, value: email },
    {
      label: "linkedin",
      href: social.linkedin || null,
      value: social.linkedin ? "message me" : "pending setup",
    },
    {
      label: "telegram",
      href: social.telegram ? `https://t.me/${social.telegram.replace(/^@/, "")}` : null,
      value: social.telegram ? social.telegram : "pending setup",
    },
    { label: "github", href: social.github || null, value: social.github ? "follow the commits" : "pending setup" },
  ];
}

export function ContactChannels() {
  const channels = buildChannels();

  return (
    <div className="panel-card flex flex-col gap-4 p-6">
      <p className="label-mono">direct channels</p>
      <ul className="flex flex-col gap-3">
        {channels.map((channel) => (
          <li key={channel.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${channel.href ? "bg-teal" : "bg-amber/60"}`}
              />
              <span className="label-mono">{channel.label}</span>
            </div>
            {channel.href ? (
              <a
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-teal hover:underline"
              >
                {channel.value}
              </a>
            ) : (
              <span className="text-sm text-paper/40">{channel.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
