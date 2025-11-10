export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Env",
  description:
    "Never build your apps with invalid environment variables again. Validate and transform your environment with ease.",
  mainNav: [
    {
      title: "Documentation",
      href: "/docs/introduction",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/introduction",
          items: [],
        },
      ],
    },
    {
      title: "Framework Guides",
      items: [
        {
          title: "Agnostic Core",
          href: "/docs/core",
          items: [],
        },
        {
          title: "Next.js",
          href: "/docs/nextjs",
          items: [],
        },
        {
          title: "Nuxt",
          href: "/docs/nuxt",
          items: [],
        },
      ],
    },
    {
      title: "Further Reading",
      items: [
        {
          title: "Standard Schema",
          href: "/docs/standard-schema",
        },
        {
          title: "Recipes",
          href: "/docs/recipes",
          items: [],
        },
        {
          title: "Customization",
          href: "/docs/customization",
          label: "New",
          items: [],
        },
      ],
    },
  ],
  links: {
    // twitter: "https://twitter.com/",
    github: "https://github.com/t3-oss/t3-env",
    docs: "/docs",
  },
};
