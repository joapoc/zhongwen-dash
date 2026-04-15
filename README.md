# Zhongwen Dash

This project has been split from a single `index.html` monolith into a small Express app with separated routes, public assets, and a modern client entry.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Structure

- `server/` Express app and route definitions
- `modules/` feature modules such as `anki` and `language`
- `views/` server-rendered HTML entry
- `public/css/` extracted styles
- `public/js/` client scripts
- `data/cache.json` local file-backed cache for saved words before a database exists
- `data/language/` optional local datasets such as CC-CEDICT and pinyin-db exports
- `archive/legacy-dashboard.html` original monolith snapshot

## Language APIs

The app now includes a `language` module that is designed to grow into the data layer for dictionary lookup, segmentation, example sentences, and character metadata.

Available endpoints:

- `GET /api/language/status`
- `GET /api/language/dictionary/search?query=学习&limit=10`
- `GET /api/language/readings/%E5%AD%A6`
- `POST /api/language/segment`
- `GET /api/language/sentences/search?query=学习&limit=5`

The local dataset files are optional. See [data/language/README.md](/c:/Users/fjn46/Desktop/zhongwen-dash/data/language/README.md) for the expected filenames and setup notes.
