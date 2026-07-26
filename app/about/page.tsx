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
          I work day to day on Azure infrastructure — network design, IP
          whitelisting, Terraform-managed environments, and disaster recovery
          that&apos;s built to actually survive a failover, not just pass a
          review.
        </p>
        <p>
          Alongside that, I&apos;ve been going deep on applied AI: not demos,
          but AI wired directly into the way infrastructure and content get
          shipped. This site is one example — posts are drafted with Claude,
          reviewed through a normal PR, and published to LinkedIn by a GitHub
          Action the moment they go live. See{" "}
          <Link href="/projects" className="text-teal hover:underline">
            /projects
          </Link>{" "}
          for how the pieces fit together.
        </p>
        <p>
          I write about what I&apos;m running into on the{" "}
          <Link href="/posts" className="text-teal hover:underline">
            log
          </Link>{" "}
          and I&apos;m open to Azure, DR, and AI/DevOps automation work — see{" "}
          <Link href="/collaborate" className="text-teal hover:underline">
            /collaborate
          </Link>
          .
        </p>
      </div>

      <h2 className="mt-16 mb-6 font-display text-2xl font-semibold">Stack</h2>
      <SkillsGrid />
    </section>
  );
}
