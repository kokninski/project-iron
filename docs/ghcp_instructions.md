# Copilot Instructions — VS Code Dev Environment & Launch Config (Astro + Cloudflare Pages)

**How to use this script**
Open **Copilot Chat** in VS Code. Paste each block titled **COPILOT PROMPT** (one at a time). Run the **TERMINAL** commands yourself in VS Code’s integrated terminal. Replace placeholders like `YOUR_DOMAIN`, `OWNER_EMAIL`, etc.

---

## A) Prerequisites & Node setup

**TERMINAL**

```bash
# 1) Install Volta (recommended) to pin Node/NPM per project
curl https://get.volta.sh | bash
# restart your terminal, then:
volta install node@20 npm@latest

# 2) Verify versions
node -v
npm -v
```

**COPILOT PROMPT — Add engines to package.json**

> Edit `package.json` to include:
>
> ```json
> {
>   "engines": { "node": ">=20" },
>   "volta": { "node": "20.12.2", "npm": "10.7.0" }
> }
> ```
>
> Use the current stable Node 20.x you have installed. Keep other fields intact.

---

## B) VS Code extension recommendations

**COPILOT PROMPT — Create `.vscode/extensions.json`**

> Create `.vscode/extensions.json` with the following recommendations:
>
> - `astro-build.astro-vscode`
> - `bradlc.vscode-tailwindcss`
> - `dbaeumer.vscode-eslint`
> - `esbenp.prettier-vscode`
> - `editorconfig.editorconfig`
> - `streetsidesoftware.code-spell-checker` (Polish dictionary optional)
> - `ms-vscode.vscode-typescript-next` (optional)
> - `github.copilot` and `github.copilot-chat`
> - `bierner.markdown-preview-github-styles`
> - `yoavbls.pretty-ts-errors` (optional)

---

## C) Workspace settings (formatting, Tailwind, Polish locale)

**COPILOT PROMPT — Create `.vscode/settings.json`**

> Create `.vscode/settings.json` with:
>
> - Default formatter Prettier, formatOnSave true.
> - ESLint: validate TS/JS, enable `eslint.useFlatConfig` if relevant.
> - Tailwind CSS IntelliSense enabled with class sorting via `prettier-plugin-tailwindcss`.
> - Files: EOL `\n`, final newline true, trim trailing whitespace.
> - Polish locale hints: set `"files.insertFinalNewline": true`, `"editor.wordWrap": "on"`, `"editor.rulers": [100]`.
> - Emmet include languages for Astro.
>   Provide the full JSON file.

**TERMINAL**

```bash
# Add Prettier Tailwind plugin
npm install -D prettier prettier-plugin-tailwindcss

# Create .editorconfig (newline, 2 spaces, utf-8)
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
EOF
```

---

## D) ESLint & Prettier config

**TERMINAL**

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

**COPILOT PROMPT — Create `.eslintrc.cjs` & `.prettierrc`**

> Generate `.eslintrc.cjs` configured for Astro + TypeScript + Prettier (using flat or classic config; pick stable). Enable recommended rules, `@typescript-eslint` plugin, and ignore `dist/`.
> Create `.prettierrc` enabling `prettier-plugin-tailwindcss` and sensible defaults (printWidth 100, singleQuote true, trailingComma all).

---

## E) NPM scripts & environment files

**COPILOT PROMPT — Update `package.json` scripts**

> Add scripts:
>
> ```json
> {
>   "scripts": {
>     "dev": "astro dev",
>     "build": "astro build",
>     "preview": "astro preview",
>     "lint": "eslint . --ext .ts,.tsx,.astro",
>     "format": "prettier --write .",
>     "cf:dev": "wrangler pages dev dist --compatibility-date=2025-01-01",
>     "cf:inspect": "wrangler pages dev dist --inspect --compatibility-date=2025-01-01"
>   }
> }
> ```
>
> Ensure `dev`, `build`, `preview` exist. Add `type": "module"` if not present.

**TERMINAL**

```bash
npm install -D wrangler
# Local env vars for Pages/Workers (not committed)
cat > .dev.vars << 'EOF'
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET=
RESEND_API_KEY=
OWNER_EMAIL=
CF_ANALYTICS_TOKEN=
EOF

# .gitignore safety
printf "\n.dev.vars\n.env\n.env.*\n" >> .gitignore
```

**COPILOT PROMPT — Create minimal `wrangler.toml`**

> Add `wrangler.toml` with:
>
> - `compatibility_date = "2025-01-01"`
> - `[vars]` reading from `.dev.vars` in local dev (Wrangler handles it automatically).
> - Note that for Cloudflare **Pages** you’ll set the same keys in the Pages project settings for production.

---

## F) VS Code Tasks (build, preview, lint)

**COPILOT PROMPT — Create `.vscode/tasks.json`**

> Create tasks:
>
> - **Dev**: runs `npm run dev` (Astro dev server at 4321).
> - **Build**: runs `npm run build`.
> - **Preview**: runs `npm run preview` (default 4321 after build).
> - **Lint**: runs `npm run lint`.
> - **Format**: runs `npm run format`.
> - **CF Pages Dev**: runs `npm run cf:dev` (serves `dist` with Pages Functions).
>   Use `presentation.reveal: always` and group `build` for Build.

**OPTIONAL** — OS‑aware task to auto‑open browser:

> Add a task `Open Browser` that opens `http://localhost:4321` using cross‑platform commands (`start` on Windows, `open` on macOS, `xdg-open` on Linux). Make it a `shell` task.

---

## G) VS Code Launch (debug configs)

**COPILOT PROMPT — Create `.vscode/launch.json`**

> Add configurations:
>
> 1. **Astro: Dev** — launch `npm run dev` under the Node debugger with source maps, `console: integratedTerminal`, `cwd: ${workspaceFolder}`.
> 2. **Astro: Preview (built)** — launch `npm run preview` (ensure `preLaunchTask": "Build"`).
> 3. **Wrangler: Pages Dev** — launch `npx wrangler pages dev dist --compatibility-date=2025-01-01`; set `preLaunchTask": "Build"`. Note: functions debug uses the Chrome DevTools opened by `--inspect`; add a `postDebugTask` note if needed.
> 4. **Compound** — `Dev (Astro + Browser)`: starts **Astro: Dev** and the `Open Browser` task.
>    Provide full JSON with comments.

---

## H) Astro & Turnstile integration

**COPILOT PROMPT — Turnstile keys in dev**

> Update `contact.astro` to read `import.meta.env.TURNSTILE_SITE_KEY` for the widget. Document that in local dev, Wrangler uses `.dev.vars` for functions only; the front-end can use `.env` loaded by Astro. Create `.env` with `PUBLIC_TURNSTILE_SITE_KEY` and update code accordingly (Astro exposes only `PUBLIC_` vars to the client). Provide code and explanation.

**TERMINAL**

```bash
# Client-exposed env vars for Astro
cat > .env << 'EOF'
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_SITE_URL=http://localhost:4321
EOF
```

---

## I) Debugging Pages Functions

**COPILOT PROMPT — Add dev guide**

> Create `DEVGUIDE.md` explaining how to:
>
> - Run `npm run dev` for front-end work (Astro live reload).
> - Build and run `npm run cf:dev` to test Pages Functions locally (uses `dist` and `functions/`).
> - Use `npm run cf:inspect` to open DevTools for functions.
> - Configure Environment Variables on Cloudflare Pages for production (TURNSTILE/RESEND/etc.).

---

## J) Git hooks (optional but recommended)

**TERMINAL**

```bash
npm install -D husky lint-staged
npx husky init
# add a pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
EOF
chmod +x .husky/pre-commit

# configure lint-staged
cat > lint-staged.config.js << 'EOF'
export default {
  "**/*.{js,ts,tsx,astro}": ["eslint --fix"],
  "**/*.{css,md,mdx,json}": ["prettier --write"],
};
EOF
```

---

## K) Copilot convenience prompts

**COPILOT PROMPT — Populate `.vscode/launch.json` and `tasks.json` now**

> Generate the actual JSON contents for `.vscode/launch.json` and `.vscode/tasks.json` based on the specs above. Ensure variables: `${workspaceFolder}` and proper `problemMatcher` where applicable. Use portable shell commands for `Open Browser`.

**COPILOT PROMPT — Verify workspace**

> Inspect the repository and confirm:
>
> - Extensions recommendations exist.
> - Settings enable Prettier/ESLint/Tailwind tooling.
> - Launch and Tasks run without errors.
> - `npm run dev` serves at 4321; `npm run cf:dev` serves built site with functions.
> - `.dev.vars` and `.env` are ignored by Git.
> - Source maps working when debugging Astro dev.

---

## L) Quick run commands

**TERMINAL**

```bash
# Start Astro dev
npm run dev
# Build and run Pages Functions locally (wrangler)
npm run build && npm run cf:dev
# Preview production build via Astro
npm run preview
# Lint & format
npm run lint && npm run format
```

---

## M) Troubleshooting

- **Port conflicts (4321):** change in `package.json` dev script: `astro dev --port 5173` and update tasks/launch accordingly.
- **ESLint not formatting:** ensure Prettier is default formatter; ESLint runs code actions on save or use `eslint --fix`.
- **Functions not picking env vars:** confirm they are present in `.dev.vars` and **not** quoted; restart `cf:dev`.
- **Turnstile token missing:** ensure client uses `PUBLIC_TURNSTILE_SITE_KEY` and server verifies with `TURNSTILE_SECRET`.

---

### Done

This guide gives Copilot everything needed to scaffold your VS Code environment, configure formatting/linting, and set up launch/tasks for **Astro dev** and **Cloudflare Pages Functions** dev.
