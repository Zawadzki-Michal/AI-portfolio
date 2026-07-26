import { StatusDot } from "@/components/StatusDot";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Projects — System Status",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Projects</h1>
        <StatusDot label={`${projects.length} deployed`} />
      </div>
      <p className="max-w-2xl text-paper/70">
        Concrete work, not a skills list — infrastructure and automation
        running in production.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
