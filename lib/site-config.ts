export const siteConfig = {
  name: "Michał Zawadzki",
  role: "System Engineer — Azure, AI & DevOps",
  headline:
    "Career-changed into tech, two years into a System Engineer role on Azure — now leaning into DevOps, automation, and applied AI. Still figuring a lot of it out, and this is where I write it down as I go.",
  email: "m.z.zawadzkimichal@gmail.com",
  /**
   * Canonical production origin — used for metadataBase, canonical/hreflang
   * tags, robots.txt, and sitemap.xml. Must be the domain that actually
   * serves without a redirect: Vercel's domain config redirects the bare
   * apex (michalzawadzki.dev) to www, so this has to be the www one — every
   * URL in the sitemap/canonical tags otherwise sends Google through an
   * avoidable extra redirect hop on every single page.
   */
  url: process.env.SITE_URL || "https://www.michalzawadzki.dev",
  social: {
    linkedin: "https://www.linkedin.com/in/michal-zawadzki-12329394/",
    github: "https://github.com/Zawadzki-Michal",
  },
};
