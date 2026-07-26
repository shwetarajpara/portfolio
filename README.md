# Shweta Rajpara — Developer Portfolio

A creative, animated developer portfolio built with React + Vite + Tailwind CSS,
themed around a code-editor / git-log aesthetic. Personalized with real content
where provided — a few sections (projects, work history) still use placeholder
copy since no resume/CV file was uploaded; see "Still placeholder" below.

## Stack
- **Vite + React 19** — build tooling & UI
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **Framer Motion** — page transitions, reveals, drag, tilt, magnetic button
- **GSAP + ScrollTrigger** — scroll-driven reveals
- **Lenis** — buttery smooth scrolling
- **Tone.js** — optional subtle UI sound design
- **react-icons** — icon set

## Unique design elements
- **Animated coding scene in the hero** — a floating laptop with a live, auto-typing
  code editor (real syntax-colored snippets, blinking caret, looping), tilting in 3D
  toward your cursor, with floating `{ }` / `</>` / `=>` symbols drifting around it.
  (This replaced the earlier rotating wireframe globe.)
- **Dependency graph skills section** — instead of progress bars, your stack is drawn
  as a radial node graph radiating from a "core" node; node size = proficiency,
  dashed teal nodes = skills you're currently "installing" (Python, AI).
- **Working command palette (⌘K / Ctrl+K)** — jump to any section, copy your email,
  open GitHub, or type `sudo hire me` for an easter egg.
- **Decoding text headings** — every heading types in from scrambled characters the
  moment it scrolls into view, via a custom `useTextScramble` hook.
- **Cursor-reactive dot-grid field** — the hero background lights up amber near your cursor.
- **Tilt + glow project cards** — cards tilt toward your cursor and flip 180° on click.
- **Boot-sequence loader** — a fake terminal boot log plays before the site reveals itself.
- **Git-graph side navigation** — the left rail shows each section as a "commit" with a
  live progress line, instead of a normal nav bar.
- **Star-shaped custom cursor** — spins continuously, speeds up over links, morphs to a
  teal outline over the coding scene.
- **Optional sound design** — quiet synth blips on hover/click, off by default (speaker
  icon, top-right).
- **Commit-log timeline** — work experience rendered as a scroll-animated git history.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Already personalized
- Name, title, location (Junagadh, Gujarat), email, GitHub & LinkedIn links
- Real skill stack: React, JavaScript/TypeScript, PHP, Node.js, MongoDB, PostgreSQL
- "Currently learning": Python, AI

## Still placeholder — swap these for your real details
| What | Where | Note |
|---|---|---|
| Project names/descriptions | `src/components/Projects.jsx` → `PROJECTS` | stacks were aligned to your real skills, but names/descriptions are invented |
| Work history | `src/components/Experience.jsx` → `COMMITS` | company names, dates, and descriptions are invented |
| Bio paragraphs | `src/components/About.jsx` | tone/content can be tightened once you share your real story |

If you share your resume text (or the real project/job details), everything in the
table above can be swapped in directly — that's the fastest way to make every
section fully yours.

## Customizing
| What | Where |
|---|---|
| Hero copy, stats | `src/components/Hero.jsx` |
| Hero coding animation | `src/components/CodeTerminal.jsx` → `SNIPPETS` array |
| Skills graph | `src/components/Skills.jsx` → `STACK` array |
| Projects | `src/components/Projects.jsx` → `PROJECTS` array |
| Work history | `src/components/Experience.jsx` → `COMMITS` array |
| Contact email / socials | `src/components/Contact.jsx` |
| Colors, fonts | `src/index.css` → `@theme` block |
| Section nav labels | `src/components/GitRail.jsx` → `NODES` array |

## Notes
- The hero coding scene is lazy-loaded (code-split) so it doesn't block first paint.
- Custom cursor auto-disables on touch devices.
