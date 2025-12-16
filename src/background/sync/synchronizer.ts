import { logger } from "@/utils/logger";
import {
  getOptions,
  updateSyncError,
  updateSyncSuccess,
} from "../storage/storageManager";
import { fetchJsonFromUrl } from "./fetcher";
import { validateLabels } from "./validator";
import { mergeLabels } from "./merger";

/**
 * Sync labels from configured URL
 * Main orchestration function that coordinates:
 * 1. Reading current options from storage
 * 2. Fetching data from URL
 * 3. Validating fetched data
 * 4. Merging with existing labels
 * 5. Saving to storage
 *
 * Errors are logged and saved to storage at each stage
 */
export async function syncLabelsFromUrl(): Promise<void> {
  try {
    // 1. Get current options from storage
    const options = await getOptions();

    if (!options?.urlSync?.enabled || !options.urlSync.url) {
      return;
    }

    // 2. Fetch data from URL
    const { data, error: fetchError } = await fetchJsonFromUrl(
      options.urlSync.url,
    );

    if (!data) {
      await updateSyncError(options, fetchError || "Failed to fetch data");
      return;
    }

    // 3. Validate fetched data
    const { labels, error: validationError } = validateLabels(data);

    if (!labels) {
      await updateSyncError(
        options,
        validationError || "Failed to validate data",
      );
      return;
    }

    // 4. Merge labels
    const { mergedLabels, newCount, updatedCount } = mergeLabels(
      options.labels,
      labels,
    );

    // 5. Save to storage
    await updateSyncSuccess(options, mergedLabels, newCount, updatedCount);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Unexpected error during sync:", errorMsg);

    // Try to save error to storage
    try {
      const options = await getOptions();
      if (options) {
        await updateSyncError(options, errorMsg);
      }
    } catch {
      // Silently fail - already logged the main error
    }
  }
}
