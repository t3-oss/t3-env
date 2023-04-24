export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Env",
  description:
    "Never build your apps with invalid environment variables again. Validate and transform your environment with the full power of Zod.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
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
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Recipes",
          href: "/docs/recipes",
          items: [],
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Framework Agnostic",
          href: "/docs/core",
          label: "New",
          items: [],
        },
        {
          title: "Next.js",
          href: "/docs/nextjs",
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
