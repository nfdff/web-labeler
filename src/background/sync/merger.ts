import { Label } from "../../options/types";

export interface MergeResult {
  mergedLabels: Label[];
  newCount: number;
  updatedCount: number;
}

export function mergeLabels(
  existingLabels: Label[],
  importedLabels: Label[],
): MergeResult {
  // Create a Map for O(1) lookups (optimization from O(n*m) to O(n+m))
  const existingMap = new Map<string, Label>();
  existingLabels.forEach((label) => {
    existingMap.set(label.id, label);
  });

  let newCount = 0;
  let updatedCount = 0;

  // Process imported labels
  importedLabels.forEach((importingLabel) => {
    if (existingMap.has(importingLabel.id)) {
      // Update existing label
      existingMap.set(importingLabel.id, importingLabel);
      updatedCount++;
    } else {
      // Add new label
      existingMap.set(importingLabel.id, importingLabel);
      newCount++;
    }
  });

  // Convert Map back to array
  const mergedLabels = Array.from(existingMap.values());

  return {
    mergedLabels,
    newCount,
    updatedCount,
  };
}
