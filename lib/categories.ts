import type { CategoryDefinition } from "@/types/article";

/**
 * Every category is backed by the `category` field of an article's frontmatter.
 * Add a category here first, then reference its display name in frontmatter.
 */
export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    tagline: "Models, research and the people building them.",
    description:
      "Reporting and analysis on large language models, generative AI, AI governance and the research shaping how machines reason, create and assist.",
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    tagline: "The engineering behind intelligent systems.",
    description:
      "Practical coverage of model training, evaluation, MLOps, embeddings and the data infrastructure that turns experiments into reliable products.",
  },
  {
    slug: "nextjs-development",
    name: "Next.js Development",
    tagline: "The React framework, in production.",
    description:
      "Deep dives into the Next.js App Router, server components, caching, rendering strategies and the patterns that keep modern web applications fast.",
  },
  {
    slug: "react-ecosystem",
    name: "React Ecosystem",
    tagline: "Components, state and the wider React world.",
    description:
      "Guides and commentary on React itself, the libraries around it, rendering performance, accessibility and the evolving component model.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    tagline: "Threats, defences and digital resilience.",
    description:
      "Clear-eyed security reporting on vulnerabilities, identity, supply-chain risk and the defensive practices that actually reduce exposure.",
  },
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    tagline: "Infrastructure without the hype.",
    description:
      "Analysis of cloud architecture, cost engineering, multi-cloud strategy and the platform services teams rely on to ship software.",
  },
  {
    slug: "linux",
    name: "Linux",
    tagline: "The open-source foundation.",
    description:
      "Practical Linux coverage: distributions, the kernel, desktop environments, servers, tooling and the open-source communities behind them.",
  },
  {
    slug: "programming-languages",
    name: "Programming Languages",
    tagline: "Design, tooling and trade-offs.",
    description:
      "Language design, type systems, compilers and the day-to-day ergonomics that determine how code is written, reviewed and maintained.",
  },
  {
    slug: "mobile-technology",
    name: "Mobile Technology",
    tagline: "Platforms, devices and mobile engineering.",
    description:
      "Reporting on iOS, Android, cross-platform frameworks, mobile performance and the devices that put computing in everyone's pocket.",
  },
  {
    slug: "hardware",
    name: "Hardware",
    tagline: "Silicon, systems and gadgets.",
    description:
      "Coverage of processors, laptops, peripherals, data-centre hardware and the engineering decisions inside the devices we use every day.",
  },
  {
    slug: "devops",
    name: "DevOps",
    tagline: "Delivery, reliability and operations.",
    description:
      "Continuous delivery, observability, platform engineering and the operational practices that keep software dependable under real-world load.",
  },
  {
    slug: "blockchain",
    name: "Blockchain",
    tagline: "Distributed systems beyond the noise.",
    description:
      "Technical and editorial coverage of distributed ledgers, smart contracts, cryptography and the real engineering constraints of decentralised systems.",
  },
];

/**
 * Homepage sections. Each section groups one or more canonical categories so the
 * front page can present broader desks without duplicating articles.
 */
export const HOME_SECTIONS: {
  title: string;
  description: string;
  categorySlugs: string[];
  href: string;
}[] = [
  {
    title: "AI & Machine Learning",
    description: "Models, research and the engineering behind intelligent products.",
    categorySlugs: ["artificial-intelligence", "machine-learning"],
    href: "/category/artificial-intelligence",
  },
  {
    title: "Software Development",
    description: "Frameworks, languages and the craft of building software.",
    categorySlugs: ["nextjs-development", "react-ecosystem", "programming-languages"],
    href: "/category/nextjs-development",
  },
  {
    title: "Cybersecurity",
    description: "Threats, defences and the practices that reduce risk.",
    categorySlugs: ["cybersecurity"],
    href: "/category/cybersecurity",
  },
  {
    title: "Hardware & Gadgets",
    description: "Silicon, systems and the devices we actually use.",
    categorySlugs: ["hardware"],
    href: "/category/hardware",
  },
  {
    title: "Cloud Computing",
    description: "Architecture, cost and the platforms teams build on.",
    categorySlugs: ["cloud-computing"],
    href: "/category/cloud-computing",
  },
  {
    title: "Mobile Technology",
    description: "Platforms, devices and mobile engineering.",
    categorySlugs: ["mobile-technology"],
    href: "/category/mobile-technology",
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryByName(name: string): CategoryDefinition | undefined {
  const normalised = name.trim().toLowerCase();
  return CATEGORIES.find(
    (category) =>
      category.name.toLowerCase() === normalised || category.slug === normalised,
  );
}

/** Categories shown in the primary navigation dropdown. */
export function getNavigationCategories(): CategoryDefinition[] {
  return CATEGORIES;
}
