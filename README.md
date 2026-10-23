# Shanmugam Poojan S | Portfolio

A React + Vite portfolio with a dark/light theme, an animated background, a 2D avatar whose eyes follow the cursor,
a winding "journey" route, and a floating terminal.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173/shanmugampoojan/
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run deploy     # publish dist/ to GitHub Pages (gh-pages branch)
```

`vite.config.js` sets `base: '/shanmugampoojan/'` for GitHub Pages. Change it if the repo name changes.

## Where the content lives

Almost everything you read on the page comes from **`src/data/portfolio.json`**. Edit the file and the page updates
(restart `npm run dev` only if you add new image files).

| Key | What it drives |
| --- | --- |
| `profile` | name, e-mail and the subtitle in "Who am I?" |
| `home.hero` | the name, role line and description in the hero |
| `about` | portrait (`photo`), intro text, interests text, and the story (`story.images`, `story.paragraphs`) |
| `skillsList`, `skillsInitialVisible` | the "My skills" cards and how many show before "View More" |
| `projects` | the "My work" cards (`title`, `description`, `tags`, `link`, `image`) |
| `journeyIntro`, `journey`, `journeyNotes` | the journey intro, chapter cards (in order, `image` is a list of up to 5 photos) and the start / end notes on the route |
| `achievements` | the numbered achievement cards |
| `more.interests` | the interest cards (`items`, `initialVisible`) |
| `more.story` | the paragraphs under "More about me" (first one is shown larger) |
| `more.books`, `more.booksVisible` | the book cards (`title`, `author`, `genre`). **The current list is placeholder data.** |
| `social`, `footer` | footer links and the closing quote (`accent` is the part shown in italics) |

Images are file names inside `public/assets/`. Drop a new file there and reference its name in the JSON.

## Hard-coded on purpose

These live in the components, not the JSON: the section headings and nav labels, the eye messages
(`src/components/Avatar.jsx`), and the terminal lines (`src/components/Terminal.jsx`).

## Project structure

```
src/
  components/   Nav, ThemeToggle, BackgroundFX, Avatar, Hero, About, Journey, Projects, More,
                ExpandGrid, Mosaic, Terminal, Footer, Lightbox, Reveal, Img
  hooks/        useTheme, useLightbox
  styles/       base, nav, hero, sections, journey, terminal, responsive (all breakpoints)
  data/         portfolio.json
public/assets/  optimized photos (about 4 MB in total, down from 53 MB)
```

## Notes

- Breakpoints: 1140 (hero side by side), 1000, 860, 700, 640 (theme button moves to the bottom-left), 560, 420, 380, 340.
- Photo tiles keep a fixed aspect ratio, so they never stretch or collapse when the screen shrinks.
- Respects `prefers-reduced-motion`; the terminal starts minimized and opens from the launcher at the bottom-right.
- Fonts (Instrument Serif, Manrope, JetBrains Mono) load from Google Fonts in `index.html`.
