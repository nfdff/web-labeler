import type { ExtensionMessage, MessageResponse } from "../types";
import { fetchJsonFromUrl } from "../sync/fetcher";
import { logger } from "../../utils/logger";

async function handleFetchJsonFromUrl(
  url: string,
  sendResponse: (response: MessageResponse<"FETCH_JSON_FROM_URL">) => void,
): Promise<void> {
  try {
    const result = await fetchJsonFromUrl(url);

    sendResponse(result);
  } catch (error) {
    const errorResponse: MessageResponse<"FETCH_JSON_FROM_URL"> = {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    sendResponse(errorResponse);
  }
}

export function setupMessageListener(): void {
  chrome.runtime.onMessage.addListener(
    (message: ExtensionMessage, _sender, sendResponse) => {
      if (message.type === "FETCH_JSON_FROM_URL") {
        // Handle async response
        handleFetchJsonFromUrl(message.url, sendResponse);
        return true; // Keep message channel open for async response
      }

      logger.warn("Unhandled message type:", message.type);
      return false;
    },
  );
}
