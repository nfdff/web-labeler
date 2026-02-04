/**
 * Background Service Worker - Entry Point
 * Initializes all background functionality for the extension
 *
 * - sync/: URL fetching, validation, merging, and synchronization
 * - storage/: Chrome storage operations
 * - alarms/: Periodic sync alarm management
 * - messages/: Message handling from UI components
 */

import browser from "webextension-polyfill";
import { logger } from "@/utils/logger";
import { STORAGE_KEY } from "./config";
import {
  initializeAlarm,
  setupAlarmListener,
  updateAlarm,
  checkAndRunMissedSync,
} from "./alarms/alarmManager";
import { setupMessageListener } from "./messages/handlers";
import { getOptions, setOptions } from "./storage/storageManager";
import type { Options } from "@/options/types";

// ============================================================================
// Extension Lifecycle Listeners
// ============================================================================

browser.runtime.onStartup.addListener(async () => {
  try {
    await initializeAlarm();
    await checkAndRunMissedSync();
  } catch (error) {
    logger.error("Error on startup:", error);
  }
});

browser.runtime.onInstalled.addListener(async () => {
  try {
    await initializeAlarm();
    await checkAndRunMissedSync();
  } catch (error) {
    logger.error("Error on install:", error);
  }
});

// ============================================================================
// Storage Change Listener
// ============================================================================

browser.storage.onChanged.addListener(async (changes, areaName) => {
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
      try {
        await updateAlarm(
          newSync?.enabled || false,
          newSync?.updateFrequency || 0,
        );

        // Clear lastUpdate when sync is disabled to avoid false "missed sync" detection
        if (!newSync?.enabled && newSync?.lastUpdate) {
          const options = await getOptions();
          if (options?.urlSync) {
            await setOptions({
              ...options,
              urlSync: {
                ...options.urlSync,
                lastUpdate: null,
              },
            });
          }
        }
      } catch (error) {
        logger.error("Error updating alarm from storage change:", error);
      }
    }
  }
});

// ============================================================================
// Setup Event Listeners
// ============================================================================

setupAlarmListener();
setupMessageListener();
