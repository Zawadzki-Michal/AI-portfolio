import { ContactForm } from "@/components/ContactForm";
import { ContactChannels } from "@/components/ContactChannels";
import { StatusDot } from "@/components/StatusDot";

export const metadata = {
  title: "Collaborate — System Status",
};

const offers = [
  {
    title: "Stuck on something similar?",
    description:
      "Working through an Azure or Terraform problem and want to compare notes? I like talking things through out loud — happy to pair or just trade what we've each found.",
  },
  {
    title: "Experimenting with AI in your workflow?",
    description:
      "I'm doing the same here — this site's own posting pipeline is the proof. Curious what others are trying and what's actually worked.",
  },
  {
    title: "Career-changed into tech, or thinking about it?",
    description:
      "I did that a couple of years ago. Happy to talk about what that was actually like, no sales pitch attached.",
  },
];

export default function CollaboratePage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <StatusDot label="open to a conversation" />
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        Let&apos;s talk, if any of this sounds familiar.
      </h1>
      <p className="mt-4 max-w-2xl text-paper/70">
        I&apos;m not pitching consulting services here — I&apos;m two years
        into a junior System Engineer role, still learning most of this. If
        you&apos;re working through similar Azure/AI/DevOps problems, made a
        similar career change, or just want to compare notes, I&apos;d
        genuinely like to hear from you.
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
            Tell me what you&apos;re working on or stuck on. I reply when I
            can — usually within a few days.
          </p>
          <div className="mt-6">
            <ContactChannels />
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
