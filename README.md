# Zhongwen Dash

This project has been split from a single `index.html` monolith into a small Express app with separated routes, public assets, and a modern client entry.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Structure

- `server/` Express app and route definitions
- `views/` server-rendered HTML entry
- `public/css/` extracted styles
- `public/js/` client scripts
- `data/cache.json` local file-backed cache for saved words before a database exists
- `archive/legacy-dashboard.html` original monolith snapshot
