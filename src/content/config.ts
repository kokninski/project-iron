import { defineCollection, z } from 'astro:content';

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

export const collections = {
  posts,
  builds,
  products,
};
