# Project Iron - Chopper Bikes Website

A custom chopper bike business website built with Astro, featuring a blog, product catalog, gallery, and contact forms. Deployed on Cloudflare Pages with serverless functions.

> 📖 **For detailed development instructions, see [DEVGUIDE.md](./DEVGUIDE.md)**

## 🚀 Project Structure

This is a content-driven website with the following key areas:

```text
/
├── src/
│   ├── content/           # Content collections (Markdown + frontmatter)
│   │   ├── posts/         # 📝 Blog posts
│   │   ├── builds/        # 🏗️ Gallery builds/projects  
│   │   ├── products/      # 🛍️ Shop products
│   │   └── config.ts      # Content schemas and validation
│   ├── pages/             # 🖥️ Website pages
│   │   ├── blog/          # Blog listing and individual posts
│   │   ├── legal/         # Legal pages (privacy, terms, etc.)
│   │   ├── shop.astro     # Product catalog
│   │   ├── gallery.astro  # Builds showcase
│   │   └── ...
│   └── components/        # Reusable UI components
├── functions/             # ⚡ Cloudflare Pages Functions (serverless)
└── public/               # Static assets (images, etc.)
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`     |
| `npm run build`           | Build your production site to `./dist/`         |
| `npm run preview`         | Preview your build locally, before deploying    |
| `npm run cf:dev`          | Test with Cloudflare Pages Functions locally    |
| `npm run cf:inspect`      | Debug Pages Functions with Chrome DevTools      |
| `npm run format`          | Format code with Prettier                       |
| `npm run lint`            | Run ESLint (when configured)                    |

## 🏗️ Building the Project

### Development
```bash
# Start development server with hot reload
npm run dev
```

### Production Build
```bash
# Build static site for deployment
npm run build

# Preview the built site locally
npm run preview
```

### Testing Cloudflare Pages Functions
```bash
# First build the project
npm run build

# Then start Pages Functions dev server
npm run cf:dev

# For debugging functions with DevTools
npm run cf:inspect
```

## 🚀 Cloudflare Pages Deployment

This project is configured for Cloudflare Pages deployment:

### Automatic Deployment
- **Production**: Automatically deployed from `main` branch
- **Preview**: Automatically deployed from pull requests
- Build command: `npm run build`
- Build output directory: `dist`

### Manual Deployment
You can also deploy manually using Wrangler CLI:
```bash
npm run build
npx wrangler pages deploy dist
```

### Environment Variables
Set these in your Cloudflare Pages project settings:
- `TURNSTILE_SITE_KEY` & `TURNSTILE_SECRET` (for contact form)
- `RESEND_API_KEY` (for email sending)
- `OWNER_EMAIL` (where contact form emails are sent)
- `CF_ANALYTICS_TOKEN` (optional, for analytics)

## ✏️ Content Management

### Blog Posts (`src/content/posts/`)
Create new blog posts by adding markdown files:

```markdown
---
title: 'Your Post Title'
date: 2025-01-15
tags: ['process', 'builds', 'inspiration']
coverImage: '/images/blog/your-image.jpg'
excerpt: 'Brief description of your post'
author: 'Your Name'
---

Your blog content here...
```

### Gallery/Builds (`src/content/builds/`)
Add new build showcases:

```markdown
---
name: 'Project Name'
year: 2025
specs: ['Custom frame', 'Hand-painted', 'LED lighting']
photos: ['/images/builds/project1.jpg', '/images/builds/project2.jpg']
clientTestimonial:
  quote: 'Amazing work!'
  author: 'Client Name'
  role: 'Customer'
---

Project description and details...
```

### Products (`src/content/products/`)
Add shop items:

```markdown
---
name: 'Product Name'
pricePLN: 299
stripeLink: 'https://buy.stripe.com/...'
photo: '/images/products/item.jpg'
---

Product description...
```

### Content Schema
All content types are validated using schemas defined in `src/content/config.ts`. Refer to this file for the complete list of required and optional fields.

## 🛠️ Development Tips

### Changes Not Refreshing?

If you update a page and don't see changes in your browser:

- Make sure your development server is running (`npm run dev`)
- Try refreshing your browser (Ctrl+R or Cmd+R)
- Clear your browser cache
- **To stop the dev server:** Press `Ctrl+C` in the terminal
- **To restart the dev server:** Run `npm run dev` again
- Check the terminal for any build errors

### Working with Content
- Content changes (blog posts, builds, products) require a server restart to see updates
- Images should be placed in `public/images/` and referenced as `/images/filename.jpg`
- All content files use frontmatter (YAML) for metadata and Markdown for content

### VS Code Integration
This project includes VS Code configurations for:
- Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- Debug configurations (F5)
- Recommended extensions
- Formatting and linting on save

For detailed setup instructions, see [DEVGUIDE.md](./DEVGUIDE.md).

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build) - Learn about Astro features and API
- [Cloudflare Pages](https://pages.cloudflare.com) - Deployment platform documentation
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework used in this project
