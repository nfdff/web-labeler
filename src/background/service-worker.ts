import { Label, Options } from "../options/types";
import { validationSchema } from "../options/validationSchema";
import validate from "../utils/schemaValidator";
import { logger } from "../utils/logger";
import type { ExtensionMessage, MessageResponse } from "./types.ts";

const ALARM_NAME = "urlSyncAlarm";
const STORAGE_KEY = "options";

//todo: refactor - split to separate modules

async function fetchJsonFromUrl(
  url: string,
): Promise<{ data: unknown | null; error?: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorMsg = `HTTP error! status: ${response.status}`;
      logger.error(errorMsg);
      return { data: null, error: errorMsg };
    }

    const data = await response.json();
    logger.info(`Successfully fetched data from URL`);
    return { data, error: undefined };
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error fetching labels";
    logger.error("Error fetching labels from URL:", errorMsg);
    return { data: null, error: errorMsg };
  }
}

function validateLabels(data: unknown): {
  labels: Label[] | null;
  error?: string;
} {
  if (!Array.isArray(data)) {
    const errorMsg = "The data doesn't contain valid labels array";
    logger.error(errorMsg);
    return { labels: null, error: errorMsg };
  }

  for (const item of data) {
    const { result: isValid, messages } = validate(item, validationSchema);
    if (!isValid) {
      const errorMsg = `Validation error: ${messages?.join("; ")}`;
      logger.error(errorMsg);
      return { labels: null, error: errorMsg };
    }
  }

  logger.info(`Successfully validated ${data.length} labels`);
  return { labels: data as Label[], error: undefined };
}

// Sync labels from URL
async function syncLabelsFromUrl() {
  try {
    const storage = await chrome.storage.sync.get(STORAGE_KEY);
    const options = storage[STORAGE_KEY] as Options | undefined;

    if (!options?.urlSync?.enabled || !options.urlSync.url) {
      return;
    }

    const { data, error: fetchError } = await fetchJsonFromUrl(
      options.urlSync.url,
    );

    if (!data) {
      // Update storage with fetch error
      const updatedOptions: Options = {
        ...options,
        urlSync: {
          ...options.urlSync,
          lastError: fetchError || "Unknown error",
        },
      };
      await chrome.storage.sync.set({ [STORAGE_KEY]: updatedOptions });
      logger.error("Failed to fetch labels:", fetchError);
      return;
    }

    // Validate data
    const { labels, error: validationError } = validateLabels(data);

    if (!labels) {
      // Update storage with validation error
      const updatedOptions: Options = {
        ...options,
        urlSync: {
          ...options.urlSync,
          lastError: validationError || "Validation failed",
        },
      };
      await chrome.storage.sync.set({ [STORAGE_KEY]: updatedOptions });
      logger.error("Failed to validate labels:", validationError);
      return;
    }

    // Merge labels (same logic as in the UI)
    const updatedLabels = [...options.labels];
    let newCount = 0;
    let updatedCount = 0;

    //todo: think to reuse mergeLabels action in Store
    labels.forEach((importingLabel) => {
      const indexToUpdate = updatedLabels.findIndex(
        (label) => label.id === importingLabel.id,
      );
      if (indexToUpdate !== -1) {
        updatedLabels[indexToUpdate] = importingLabel;
        updatedCount++;
      } else {
        updatedLabels.push(importingLabel);
        newCount++;
      }
    });

    // Update storage with merged labels, last update time, and clear any error
    const updatedOptions: Options = {
      ...options,
      labels: updatedLabels,
      urlSync: {
        ...options.urlSync,
        lastUpdate: Date.now(),
        lastError: undefined,
      },
    };

    await chrome.storage.sync.set({ [STORAGE_KEY]: updatedOptions });
    logger.info(
      `Labels synced successfully: ${newCount} new, ${updatedCount} updated`,
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error syncing labels:", errorMsg);

    // Try to save error to storage
    try {
      const storage = await chrome.storage.sync.get(STORAGE_KEY);
      const options = storage[STORAGE_KEY] as Options | undefined;
      if (options?.urlSync) {
        const updatedOptions: Options = {
          ...options,
          urlSync: {
            ...options.urlSync,
            lastError: errorMsg,
          },
        };
        await chrome.storage.sync.set({ [STORAGE_KEY]: updatedOptions });
      }
    } catch {
      // Ignore storage errors
    }
  }
}

// Update or clear the alarm based on settings
async function updateAlarm(enabled: boolean, updateFrequency: number) {
  // Clear existing alarm
  await chrome.alarms.clear(ALARM_NAME);

  if (enabled && updateFrequency > 0) {
    // Create new alarm with the specified frequency
    await chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: updateFrequency,
    });
    logger.info(`URL sync alarm created: every ${updateFrequency} minutes`);
  } else {
    logger.info("URL sync alarm cleared");
  }
}

// Initialize alarm on extension startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    logger.info("Extension started, initializing URL sync alarm");
    const storage = await chrome.storage.sync.get(STORAGE_KEY);
    const options = storage[STORAGE_KEY] as Options | undefined;

    if (options?.urlSync) {
      await updateAlarm(
        options.urlSync.enabled,
        options.urlSync.updateFrequency,
      );
    }
  } catch (error) {
    logger.error("Error on startup:", error);
  }
});

// Initialize alarm on extension install
chrome.runtime.onInstalled.addListener(async () => {
  try {
    logger.info("Extension installed, initializing URL sync alarm");
    const storage = await chrome.storage.sync.get(STORAGE_KEY);
    const options = storage[STORAGE_KEY] as Options | undefined;

    if (options?.urlSync) {
      await updateAlarm(
        options.urlSync.enabled,
        options.urlSync.updateFrequency,
      );
    }
  } catch (error) {
    logger.error("Error on install:", error);
  }
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    logger.info("URL sync alarm triggered");
    await syncLabelsFromUrl();
  }
});

// Listen for storage changes to update alarm
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes[STORAGE_KEY]) {
    const oldOptions = changes[STORAGE_KEY].oldValue as Options | undefined;
    const newOptions = changes[STORAGE_KEY].newValue as Options | undefined;

    const oldSync = oldOptions?.urlSync;
    const newSync = newOptions?.urlSync;

    // Check if the alarm-relevant fields actually changed
    const enabledChanged = oldSync?.enabled !== newSync?.enabled;
    const frequencyChanged =
      oldSync?.updateFrequency !== newSync?.updateFrequency;

    // Only update alarm if settings that affect it changed
    if (enabledChanged || frequencyChanged) {
      logger.info(
        `URL sync alarm settings changed: enabled=${newSync?.enabled}, frequency=${newSync?.updateFrequency}`,
      );
      void updateAlarm(
        newSync?.enabled || false,
        newSync?.updateFrequency || 0,
      );
    }
  }
});

// Listen for messages from UI components (type-safe)
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === "FETCH_JSON_FROM_URL") {
      fetchJsonFromUrl(message.url)
        .then((result: MessageResponse<"FETCH_JSON_FROM_URL">) => {
          sendResponse(result);
        })
        .catch((error) => {
          const errorResponse: MessageResponse<"FETCH_JSON_FROM_URL"> = {
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
          };
          sendResponse(errorResponse);
        });

      return true; // Keep message channel open for async response
    }

    return false; // Not handled, close channel
  },
);
