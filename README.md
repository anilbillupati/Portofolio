# Anil Billupati · Portfolio

Personal portfolio site built with React, TypeScript and Vite. One page serves two audiences: recruiters hiring for **Java backend** roles and recruiters hiring for **Generative AI** roles.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` type-checks and builds to `dist/`. `npm run preview` serves that build locally.

## Customize from the browser

In `npm run dev`, click **Customize** in the top bar to:

- upload, replace or remove your profile photo (it's cropped and compressed automatically)
- add, remove or rename skills and skill categories
- edit your name, contact details, links (LinkedIn, GitHub, LeetCode, Credly, project repos), headlines and summaries

Edits are kept as a draft in your browser. Click **Save to project** to write them into `src/data/portfolio.json`, which is the file that gets deployed. **Export** and **Import** download and load the same data as JSON.

On the deployed site the editor is hidden. Add `?edit` to the URL to open it there; changes made that way stay in your own browser until you export them.

## Tailored links for recruiters

The "Tailor this page for" switch reorders skills and filters experience highlights. Each view has its own URL:

| View          | URL                                              |
| ------------- | ------------------------------------------------ |
| Full profile  | `https://<user>.github.io/<repo>/`               |
| Java backend  | `https://<user>.github.io/<repo>/?focus=backend` |
| Generative AI | `https://<user>.github.io/<repo>/?focus=ai`      |

## Resume downloads

Put the PDFs here (the download buttons only appear once the files exist):

- `public/resumes/Anil_Billupati_Java_Backend.pdf`
- `public/resumes/Anil_Billupati_GenAI.pdf`

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository on the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.

## Scripts

| Command           | What it does                               |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Dev server with hot reload and the editor  |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally         |
| `npm run lint`    | ESLint (TypeScript + React Hooks rules)    |
| `npm run format`  | Format everything with Prettier            |

## Project structure

```
src/
├── App.tsx                  # Page composition and top-level state
├── main.tsx                 # Entry point; global styles load first
├── data/portfolio.json      # ALL content: profile, skills, experience, projects…
├── types/portfolio.ts       # TypeScript types for that data
├── config/site.ts           # Nav sections, focus options, storage keys
├── hooks/                   # useFocus, usePortfolio, useTheme, useInView, useCountUp, useTypewriter…
├── lib/                     # Pure helpers: experience math, formatting, storage, motion
├── styles/
│   ├── tokens.css           # Colors, shadows, easing for light and dark themes
│   ├── base.css             # Reset, typography, buttons, inputs, cards
│   └── animations.css       # Shared keyframes and the scroll-reveal system
└── components/
    ├── layout/              # Navbar, Footer, ScrollProgress, BackToTop
    ├── sections/            # One folder per page section (component + its CSS)
    │   ├── Hero/  TechMarquee/  Skills/  Experience/
    │   └── Projects/  Credentials/  Contact/
    ├── editor/              # Customize toolbar and profile editor modal
    └── ui/                  # Small reusable pieces: Icons, Reveal, Rich, FocusSwitch…
```

**Years of experience** are never typed by hand. They're calculated from the job dates in `portfolio.json` (rounded down to the nearest half year, e.g. `2.5+`) and inserted wherever `{{years}}` appears, so the summary, stats and job card always agree and update on their own over time.

To change the color scheme, edit the variables in `src/styles/tokens.css`.

All motion respects the visitor's "reduce motion" OS setting.
