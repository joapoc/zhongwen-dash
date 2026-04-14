import axios from "axios";
import { Request, Response } from "express";

const ANKI_CONNECT_URLS = ["http://127.0.0.1:8765", "http://localhost:8765"];
const ANKI_CONNECT_VERSION = 6;

type AnkiConnectResponse = {
  result: unknown;
  error: string | null;
};

type AnkiMultiAction = {
  action: string;
  params?: Record<string, unknown>;
};

type DeckSummary = {
  name: string;
  totalCards: number;
  dueCards: number;
};

const parseAnkiResponse = (data: unknown) => {
  if (
    !data ||
    typeof data !== "object" ||
    !("result" in data) ||
    !("error" in data)
  ) {
    throw new Error("Anki returned an unexpected response.");
  }

  return data as AnkiConnectResponse;
};

const createAnkiPayload = (action: string, params?: Record<string, unknown>) =>
  params
    ? {
        action,
        version: ANKI_CONNECT_VERSION,
        params,
      }
    : {
        action,
        version: ANKI_CONNECT_VERSION,
      };

const formatAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const code = error.code ? ` code=${error.code}` : "";
    const syscall =
      typeof error.cause === "object" &&
      error.cause &&
      "syscall" in error.cause &&
      typeof error.cause.syscall === "string"
        ? ` syscall=${error.cause.syscall}`
        : "";
    const errno =
      typeof error.cause === "object" &&
      error.cause &&
      "errno" in error.cause &&
      typeof error.cause.errno !== "undefined"
        ? ` errno=${String(error.cause.errno)}`
        : "";

    return `${error.message}${code}${syscall}${errno}`;
  }

  return error instanceof Error ? error.message : String(error);
};

const postToAnki = async (action: string, params?: Record<string, unknown>) => {
  const payload = createAnkiPayload(action, params);
  let lastError: Error | null = null;

  for (const url of ANKI_CONNECT_URLS) {
    try {
      console.log(`[anki] -> ${action} via ${url}`);

      const { data } = await axios.post<AnkiConnectResponse>(url, payload, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`[anki] <- ${action} via ${url}`, data);

      const parsed = parseAnkiResponse(data);

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      return parsed.result;
    } catch (error) {
      const formattedError = formatAxiosError(error);
      console.error(`[anki] xx ${action} via ${url}: ${formattedError}`);
      lastError = error instanceof Error ? error : new Error(formattedError);
    }
  }

  throw lastError ?? new Error("Could not reach Anki-Connect.");
};

const buildFindCardsQuery = (deckName: string, suffix = "") => {
  const escapedDeckName = deckName.replace(/"/g, '\\"');
  return `deck:"${escapedDeckName}"${suffix}`;
};

const getDeckSummaries = async (deckNames: string[]) => {
  if (deckNames.length === 0) {
    return [] as DeckSummary[];
  }

  const actions: AnkiMultiAction[] = deckNames.flatMap((deckName) => [
    {
      action: "findCards",
      params: {
        query: buildFindCardsQuery(deckName),
      },
    },
    {
      action: "findCards",
      params: {
        query: buildFindCardsQuery(deckName, " is:due"),
      },
    },
  ]);

  const multiResult = await postToAnki("multi", { actions });
  const results = Array.isArray(multiResult) ? multiResult : [];

  return deckNames.map((deckName, index) => {
    const totalCards = Array.isArray(results[index * 2]) ? results[index * 2].length : 0;
    const dueCards = Array.isArray(results[index * 2 + 1])
      ? results[index * 2 + 1].length
      : 0;

    return {
      name: deckName,
      totalCards,
      dueCards,
    };
  });
};

export const getAnkiDecks = async (_req: Request, res: Response) => {
  try {
    const result = await postToAnki("deckNames");
    const deckNames = Array.isArray(result)
      ? result.filter((deck): deck is string => typeof deck === "string")
      : [];
    const decks = await getDeckSummaries(deckNames);

    return res.status(200).json({
      ok: true,
      route: "/api/anki/decks",
      timestamp: new Date().toISOString(),
      count: decks.length,
      totals: {
        cards: decks.reduce((sum, deck) => sum + deck.totalCards, 0),
        due: decks.reduce((sum, deck) => sum + deck.dueCards, 0),
      },
      decks,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not reach Anki-Connect at http://127.0.0.1:8765.";

    return res.status(502).json({
      ok: false,
      route: "/api/anki/decks",
      message,
      debug: {
        hostsTried: ANKI_CONNECT_URLS,
        action: "deckNames",
      },
    });
  }
};

export const openAnkiDeck = async (req: Request, res: Response) => {
  const deckName =
    typeof req.body?.deckName === "string" ? req.body.deckName.trim() : "";

  if (!deckName) {
    return res.status(400).json({
      ok: false,
      route: "/api/anki/decks/open",
      message: "deckName is required.",
    });
  }

  try {
    const result = await postToAnki("guiDeckOverview", { name: deckName });

    if (result !== true) {
      return res.status(502).json({
        ok: false,
        route: "/api/anki/decks/open",
        message: `Could not open deck "${deckName}" in Anki.`,
      });
    }

    return res.status(200).json({
      ok: true,
      route: "/api/anki/decks/open",
      deckName,
      opened: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Could not open deck "${deckName}" in Anki.`;

    return res.status(502).json({
      ok: false,
      route: "/api/anki/decks/open",
      message,
      debug: {
        hostsTried: ANKI_CONNECT_URLS,
        action: "guiDeckOverview",
        deckName,
      },
    });
  }
};
