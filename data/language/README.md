# Language Resource Setup

This folder is where local language datasets should live for the app.

Supported resources:

- `cedict_ts.u8` or `cedict_1_0_ts_utf-8_mdbg.txt`
  Use for CC-CEDICT dictionary search.
- `pinyin_db.txt` or `pinyin-db.txt`
  Use for per-character pinyin readings.

Suggested workflow:

1. Download and unpack CC-CEDICT into this folder.
2. Generate or copy the pinyin-db text export into this folder.
3. Restart the app or call `GET /api/language/status` to confirm the files were detected.

Notes:

- CC-CEDICT is licensed under CC BY-SA 4.0.
- Tatoeba results are fetched live from the Tatoeba API and do not need a local file here.
- Jieba segmentation is provided by the installed `jieba-wasm` package.
- Hanzi Writer packages are installed and ready for later frontend work, but no UI is wired yet.
