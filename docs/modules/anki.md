# Anki module

Path: [modules/anki/](../../modules/anki/).

Thin proxy between the Zhongwen Dash HTTP API and a local Anki desktop install running the [Anki-Connect](https://ankiweb.net/shared/info/2055492159) add-on.

## Files

| File | Role |
|---|---|
| [index.ts](../../modules/anki/index.ts) | Re-exports `ankiRoutes` and the two controller functions |
| [anki.routes.ts](../../modules/anki/anki.routes.ts) | Two routes: `GET /decks`, `POST /decks/open` |
| [anki.controller.ts](../../modules/anki/anki.controller.ts) | All the logic lives here — no service or data file |

Unlike the language module, Anki has no local datasets, no caching, and no scoring — everything it needs lives in another process, so the controller is the whole module.

## How it talks to Anki

Anki-Connect listens on `http://127.0.0.1:8765` by default. The controller keeps two URLs to try in order:

```ts
const ANKI_CONNECT_URLS = ["http://127.0.0.1:8765", "http://localhost:8765"];
```

Why both? On some Windows setups, `127.0.0.1` and `localhost` resolve differently (IPv4 vs IPv6), and Anki-Connect only binds to one of them. The controller's [`postToAnki`](../../modules/anki/anki.controller.ts) helper iterates both URLs, logging every attempt, and only surfaces the last error if all fail.

Every request is an HTTP `POST` with this body shape:

```json
{ "action": "<name>", "version": 6, "params": { ... } }
```

Request/response logging is intentional — every call logs `[anki] -> <action> via <url>`, response body, and any failure with `code=`, `syscall=`, `errno=` annotations extracted from axios errors (see [`formatAxiosError`](../../modules/anki/anki.controller.ts)).

Timeout per attempt: **5000 ms**.

## `GET /api/anki/decks`

1. Call `deckNames` → array of strings.
2. Build a `multi` batch: for each deck name, two `findCards` queries — one without a filter (total cards) and one with ` is:due` (due cards). Deck names are escaped by replacing `"` with `\"` inside `deck:"..."`.
3. Walk the returned array in pairs: `results[i*2]` is total, `results[i*2 + 1]` is due.
4. Return `{ count, totals: { cards, due }, decks: [{ name, totalCards, dueCards }] }`.

On any Anki-Connect error returns 502 with `debug.hostsTried` so the client can see both attempts failed.

## `POST /api/anki/decks/open`

Body: `{ "deckName": "..." }`. Calls `guiDeckOverview` in Anki-Connect, which opens that deck in the Anki desktop UI (foregrounding the window). Requires Anki to already be running.

- 400 if `deckName` is missing or empty-after-trim.
- 502 if Anki-Connect returns anything other than `true`, or is unreachable.

## Anki-Connect requirements

Users need the Anki-Connect add-on installed and Anki running:

1. Anki desktop → Tools → Add-ons → Get Add-ons → paste `2055492159`.
2. Restart Anki.
3. Anki-Connect listens on `:8765` automatically. No configuration needed for a default setup.

If Anki isn't running, `/api/anki/decks` returns 502 immediately (connection refused on both URLs).

## Adding a new Anki action

Because everything goes through [`postToAnki`](../../modules/anki/anki.controller.ts), a new handler is typically ~20 lines:

```ts
export const newAction = async (req: Request, res: Response) => {
  try {
    const result = await postToAnki("someAnkiConnectAction", { /* params */ });
    return res.status(200).json({ ok: true, route: "/api/anki/new", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "...";
    return res.status(502).json({ ok: false, route: "/api/anki/new", message });
  }
};
```

Then add the route in [anki.routes.ts](../../modules/anki/anki.routes.ts) and re-export from [index.ts](../../modules/anki/index.ts). Document it in [api-reference.md](../api-reference.md).

For batches of Anki-Connect calls, use the built-in `multi` action (already used by `getDeckSummaries`) rather than sending each as a separate HTTP request — much lower latency.
