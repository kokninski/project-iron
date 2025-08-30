# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Below is a high-level overview of the project structure, showing only the main directories and key subfolders:

```text
/
├── astro.config.mjs
├── package.json
├── README.md
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── site.webmanifest
│   └── images/
│       ├── about/
│       ├── avatars/
│       ├── blog/
│       ├── builds/
│       ├── products/
│       └── hero-bg.jpg
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   ├── posts/
│   │   ├── builds/
│   │   └── products/
│   ├── layouts/
│   └── pages/
│       ├── blog/
│       ├── legal/
│       └── ...
```

This structure highlights the main organization of the project. For details on files and implementation, see the code in each directory.

To learn more about the folder structure of an Astro project, refer to [Astro's guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🛠️ Troubleshooting: Changes Not Refreshing

If you update a page (e.g., `about.astro`) and do not see changes in your browser preview:

- Make sure your development server is running (`npm run dev`).
- Try refreshing your browser (Ctrl+R or Cmd+R).
- Clear your browser cache.
- **To stop the dev server:** Press `Ctrl+C` in the terminal where it's running.
- **To restart the dev server:** Run `npm run dev` again in your project directory.
- Ensure you are editing the correct file and saving your changes.
- Check the terminal for any build errors.

If the issue persists, see [Astro's troubleshooting guide](https://docs.astro.build/en/troubleshooting/).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
