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
      logger.info(`URL sync alarm created: every ${updateFrequency} minutes`);
    } else {
      logger.info("URL sync alarm cleared");
    }
  } catch (error) {
    logger.error("Error updating alarm:", error);
  }
}

export async function initializeAlarm(): Promise<void> {
  try {
    const options = await getOptions();

    if (options?.urlSync) {
      await updateAlarm(
        options.urlSync.enabled,
        options.urlSync.updateFrequency,
      );
    }
  } catch (error) {
    logger.error("Error initializing alarm:", error);
  }
}

export function setupAlarmListener(): void {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
      logger.info("URL sync alarm triggered");
      await syncLabelsFromUrl();
    }
  });
}
