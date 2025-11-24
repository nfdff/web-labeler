import { logger } from "../../utils/logger";
import { ALARM_NAME } from "../config";
import { getOptions } from "../storage/storageManager";
import { syncLabelsFromUrl } from "../sync/synchronizer";

export async function updateAlarm(
  enabled: boolean,
  updateFrequency: number,
): Promise<void> {
  try {
    // Clear existing alarm
    await chrome.alarms.clear(ALARM_NAME);

    if (enabled && updateFrequency > 0) {
      // Create new alarm with the specified frequency
      await chrome.alarms.create(ALARM_NAME, {
        periodInMinutes: updateFrequency,
      });
    }
  } catch (error) {
    logger.error("Error updating alarm:", error);
  }
}

export async function initializeAlarm(): Promise<void> {
  try {
    const options = await getOptions();

    if (options?.urlSync?.enabled && options.urlSync.updateFrequency > 0) {
      // Check if alarm already exists before recreating
      const existingAlarm = await chrome.alarms.get(ALARM_NAME);
      if (!existingAlarm) {
        await chrome.alarms.create(ALARM_NAME, {
          periodInMinutes: options.urlSync.updateFrequency,
        });
      }
    } else {
      // Ensure alarm is cleared if disabled
      await chrome.alarms.clear(ALARM_NAME);
    }
  } catch (error) {
    logger.error("Error initializing alarm:", error);
  }
}

export async function checkAndRunMissedSync(): Promise<void> {
  try {
    const options = await getOptions();

    if (!options?.urlSync?.enabled || !options.urlSync.url) {
      return;
    }

    const { lastUpdate, updateFrequency } = options.urlSync;

    // If no lastUpdate, this is first run - don't sync yet, let alarm handle it
    if (!lastUpdate || updateFrequency <= 0) {
      return;
    }

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;
    const frequencyMs = updateFrequency * 60 * 1000;

    // Check if we missed a sync (with small buffer for timing precision)
    if (timeSinceLastUpdate >= frequencyMs) {
      await syncLabelsFromUrl();
    }
  } catch (error) {
    logger.error("Error checking for missed sync:", error);
  }
}

export function setupAlarmListener(): void {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
      await syncLabelsFromUrl();
    }
  });
}
