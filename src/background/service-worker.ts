import { Label, Options } from "../options/types";
import { validationSchema } from "../options/validationSchema";
import validate from "../utils/schemaValidator";
import { logger } from "../utils/logger";

const ALARM_NAME = "urlSyncAlarm";
const STORAGE_KEY = "options";

// Fetch and validate labels from URL
async function fetchLabelsFromUrl(url: string): Promise<{ labels: Label[] | null; error?: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorMsg = `HTTP error! status: ${response.status}`;
      logger.error(errorMsg);
      return { labels: null, error: errorMsg };
    }

    const result = await response.json();

    if (!Array.isArray(result)) {
      const errorMsg = "The URL doesn't return valid labels array";
      logger.error(errorMsg);
      return { labels: null, error: errorMsg };
    }

    // Validate each label
    for (const item of result) {
      const { result: isValid, messages } = validate(item, validationSchema);
      if (!isValid) {
        const errorMsg = `Validation error: ${messages?.join("; ")}`;
        logger.error(errorMsg);
        return { labels: null, error: errorMsg };
      }
    }

    logger.info(`Successfully fetched ${result.length} labels from URL`);
    return { labels: result as Label[], error: undefined };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error fetching labels";
    logger.error("Error fetching labels from URL:", errorMsg);
    return { labels: null, error: errorMsg };
  }
}

// Sync labels from URL
async function syncLabelsFromUrl() {
  try {
    const storage = await chrome.storage.sync.get(STORAGE_KEY);
    const options = storage[STORAGE_KEY] as Options | undefined;

    if (!options?.urlSync?.enabled || !options.urlSync.url) {
      logger.info("URL sync is disabled or URL is not set");
      return;
    }

    logger.info("Starting URL sync from:", options.urlSync.url);
    const { labels, error } = await fetchLabelsFromUrl(options.urlSync.url);

    if (labels) {
      // Merge labels (same logic as in the UI)
      const updatedLabels = [...options.labels];
      let newCount = 0;
      let updatedCount = 0;

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
      logger.info(`Labels synced successfully: ${newCount} new, ${updatedCount} updated`);
    } else {
      // Update storage with error
      const updatedOptions: Options = {
        ...options,
        urlSync: {
          ...options.urlSync,
          lastError: error || "Unknown error",
        },
      };
      await chrome.storage.sync.set({ [STORAGE_KEY]: updatedOptions });
      logger.error("Failed to sync labels:", error);
    }
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
      await updateAlarm(options.urlSync.enabled, options.urlSync.updateFrequency);
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
      await updateAlarm(options.urlSync.enabled, options.urlSync.updateFrequency);
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
    const frequencyChanged = oldSync?.updateFrequency !== newSync?.updateFrequency;

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
    // Ignore changes to url, lastUpdate, lastError, or other unrelated fields
  }
});
