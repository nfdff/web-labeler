import { Options } from "../../options/types";
import { STORAGE_KEY } from "../config";
import { logger } from "../../utils/logger";

export async function getOptions(): Promise<Options | undefined> {
  try {
    const storage = await chrome.storage.sync.get(STORAGE_KEY);
    return storage[STORAGE_KEY] as Options | undefined;
  } catch (error) {
    logger.error("Error reading from storage:", error);
    return undefined;
  }
}

export async function setOptions(options: Options): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: options });
  } catch (error) {
    logger.error("Error writing to storage:", error);
    throw error;
  }
}

export async function updateSyncError(
  options: Options,
  error: string,
): Promise<void> {
  if (!options.urlSync) {
    return;
  }

  const updatedOptions: Options = {
    ...options,
    urlSync: {
      ...options.urlSync,
      lastError: error,
    },
  };

  await setOptions(updatedOptions);
  logger.error("Sync error saved to storage:", error);
}

export async function updateSyncSuccess(
  options: Options,
  newLabels: Options["labels"],
  newCount: number,
  updatedCount: number,
): Promise<void> {
  if (!options.urlSync) {
    return;
  }

  const updatedOptions: Options = {
    ...options,
    labels: newLabels,
    urlSync: {
      ...options.urlSync,
      lastUpdate: Date.now(),
      lastError: undefined,
    },
  };

  await setOptions(updatedOptions);
  logger.info(
    `Sync success: ${newCount} new, ${updatedCount} updated labels saved to storage`,
  );
}
