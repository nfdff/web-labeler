import browser from "webextension-polyfill"
import { logger } from "@/utils/logger"
import { fetchJsonFromUrl } from "../sync/fetcher"
import type { ExtensionMessage, MessageResponse } from "../types"

async function handleFetchJsonFromUrl(
  url: string
): Promise<MessageResponse<"FETCH_JSON_FROM_URL">> {
  try {
    return await fetchJsonFromUrl(url)
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function setupMessageListener(): void {
  browser.runtime.onMessage.addListener(
    async (
      message: unknown
    ): Promise<MessageResponse<"FETCH_JSON_FROM_URL"> | undefined> => {
      const msg = message as ExtensionMessage
      if (msg.type === "FETCH_JSON_FROM_URL") {
        return await handleFetchJsonFromUrl(msg.url)
      }

      logger.warn("Unhandled message type:", msg.type)
      return undefined
    }
  )
}
