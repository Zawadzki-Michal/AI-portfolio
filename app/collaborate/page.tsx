import { ContactForm } from "@/components/ContactForm";
import { StatusDot } from "@/components/StatusDot";

export const metadata = {
  title: "Collaborate — System Status",
};

const offers = [
  {
    title: "Azure infrastructure review",
    description:
      "Audit of network design, IP whitelisting rules, and Terraform-managed resources — with a prioritized remediation plan.",
  },
  {
    title: "Disaster recovery planning",
    description:
      "DR runbooks and failover procedures for Azure workloads, built and tested against real failure scenarios — not just documented.",
  },
  {
    title: "AI-assisted DevOps automation",
    description:
      "CI/CD pipelines and internal tooling augmented with Claude — from draft generation to automated publishing, like the one running this site.",
  },
];

export default function CollaboratePage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <StatusDot label="accepting new engagements" />
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        Let&apos;s build something that stays up.
      </h1>
      <p className="mt-4 max-w-2xl text-paper/70">
        I work with teams shipping on Azure who want infrastructure that
        survives contact with reality, and with teams who want to put AI
        tooling into their actual delivery pipeline — not just a chatbot on
        the side.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {offers.map((offer) => (
          <div key={offer.title} className="panel-card flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{offer.title}</h2>
              <StatusDot />
            </div>
            <p className="text-sm text-paper/70">{offer.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
          <p className="mt-3 max-w-md text-paper/70">
            Tell me what you&apos;re running into — infrastructure, DR, or an
            AI/DevOps workflow you want automated. I reply within a couple of
            business days.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
