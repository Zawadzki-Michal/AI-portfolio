import Link from "next/link";
import { StatusDot } from "@/components/StatusDot";
import { SkillsGrid } from "@/components/SkillsGrid";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About — System Status",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <StatusDot label="online" />
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="mt-2 label-mono">{siteConfig.role}</p>
      <p className="mt-6 max-w-2xl text-lg text-paper/80">{siteConfig.headline}</p>

      <div className="mt-8 max-w-2xl space-y-4 text-paper/70">
        <p>
          I&apos;m two years into a System Engineer role, working day to day
          with Azure infrastructure — network design, IP whitelisting,
          Terraform-managed environments, disaster recovery. I don&apos;t
          write this as someone who&apos;s got it all figured out. Most weeks
          I&apos;m still looking things up, breaking things in a test
          environment first, and learning from people on my team who&apos;ve
          been doing this a lot longer than I have.
        </p>
        <p>
          Outside work I&apos;ve been curious about applied AI — not as a
          buzzword, but as something to actually build with. This site is one
          result of that: I wanted to see if I could wire AI directly into
          how a personal blog gets written and published, so posts get
          drafted with Claude, reviewed through a normal PR, and pushed to
          LinkedIn by a GitHub Action once they&apos;re live. See{" "}
          <Link href="/projects" className="text-teal hover:underline">
            /projects
          </Link>{" "}
          for how it actually works.
        </p>
        <p>
          I write about whatever I&apos;m currently stuck on or excited about
          on the{" "}
          <Link href="/posts" className="text-teal hover:underline">
            log
          </Link>
          . If you&apos;re on a similar path — junior, career-changed into
          tech, or just curious about the same things — I&apos;d genuinely
          like to hear from you, see{" "}
          <Link href="/collaborate" className="text-teal hover:underline">
            /collaborate
          </Link>
          .
        </p>
      </div>

      <h2 className="mt-16 mb-2 font-display text-2xl font-semibold">
        What I&apos;m working with
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-paper/50">
        Not mastery — just where most of my time actually goes.
      </p>
      <SkillsGrid />
    </section>
  );
}
