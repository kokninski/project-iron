import { defineCollection, z } from 'astro:content';

// Featured products collection
const featuredProductsSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default('Polecane produkty'),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1), // must match a file slug in products collection
        badge: z.string().optional(), // e.g. "Nowość", "Bestseller"
        priceOverridePLN: z.number().optional(),
        ctaLabel: z.string().optional(), // e.g. "Kup teraz", defaults to product button label
      }),
    )
    .max(8)
    .default([]),
});

const featured = defineCollection({ type: 'content', schema: featuredProductsSchema });

// Blog posts collection
const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    coverImage: z.string(),
    excerpt: z.string(),
    author: z.string(),
  }),
});

// Builds collection
const builds = defineCollection({
  schema: z.object({
    name: z.string(),
    year: z.number(),
    specs: z.array(z.string()),
    photos: z.array(z.string()),
    clientTestimonial: z
      .object({
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
      })
      .optional(),
  }),
});

// Products collection
const products = defineCollection({
  schema: z.object({
    name: z.string(),
    pricePLN: z.number(),
    stripeLink: z.string(),
    photo: z.string(),
  }),
});

// Home collection
const homeSchema = z.object({
  hero: z.object({
    title: z.string().min(3),
    subtitle: z.string().min(3),
    backgroundImage: z.string().url().or(z.string().startsWith('/')),
    primaryCta: z.object({ label: z.string(), href: z.string() }),
    secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
  featuredBuild: z.object({
    slug: z.string().min(1), // must match a file in content/builds
    testimonial: z.string().optional(),
    author: z.string().min(2).optional(),
  }),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(3),
        author: z.string().min(2),
        role: z.string().optional(),
        avatarUrl: z.string().url().or(z.string().startsWith('/')).optional(),
      }),
    )
    .default([]),
  ctaBand: z.object({
    text: z.string(),
    primaryCta: z.object({ label: z.string(), href: z.string() }),
  }),
  latestBlog: z
    .object({
      enabled: z.boolean().default(true),
      limit: z.number().int().min(1).max(12).default(3),
    })
    .default({ enabled: true, limit: 3 }),
});

const home = defineCollection({ type: 'content', schema: homeSchema });

export const collections = {
  posts,
  builds,
  products,
  home,
  featured,
};
