import { Label } from "../../../../../options/types.ts";
import { EnvMarkerLabel } from "../types.ts";

export interface CombineResult {
  combined: Label[];
  originalCount: number;
  combinedCount: number;
}

export function combineLabels(
  labels: Label[],
  originalData: EnvMarkerLabel[],
): CombineResult {
  // Group by: name + color + fontSize + position (ORIGINAL EnvMarker values)
  const groups = new Map<string, Label[]>();

  labels.forEach((label, index) => {
    const original = originalData[index];
    const key = `${original.name}|${original.color}|${original.fontSize}|${original.position}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(label);
  });

  // Merge rules for groups with multiple labels
  const combined: Label[] = [];
  groups.forEach((groupLabels) => {
    if (groupLabels.length === 1) {
      combined.push(groupLabels[0]);
    } else {
      // Keep first label, merge all rules
      const mergedLabel = {
        ...groupLabels[0],
        rules: groupLabels.flatMap((l) => l.rules),
      };
      combined.push(mergedLabel);
    }
  });

  return {
    combined,
    originalCount: labels.length,
    combinedCount: combined.length,
  };
}
