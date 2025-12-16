import { MessageKey } from "@/i18n/types"

export const ruleTypes = [
  "contains",
  "startsWith",
  "endsWith",
  "matches",
  "regexp",
] as const;

export type RuleType = (typeof ruleTypes)[number];

export interface RuleTypeSettings {
  labelKey: MessageKey;
}

export const ruleTypeSettings = {
  contains: {
    labelKey: "ruleType_contains",
  },
  startsWith: {
    labelKey: "ruleType_startsWith",
  },
  endsWith: {
    labelKey: "ruleType_endsWith",
  },
  matches: {
    labelKey: "ruleType_matches",
  },
  regexp: {
    labelKey: "ruleType_regexp",
  },
} as const satisfies Record<RuleType, RuleTypeSettings>;

export const sourceTypes = ["hostname", "fullUrl"] as const;
export type SourceType = (typeof sourceTypes)[number];

export interface SourceTypeSettings {
  labelKey: MessageKey;
}

export const sourceTypeSettings = {
  hostname: {
    labelKey: "sourceType_hostname",
  },
  fullUrl: {
    labelKey: "sourceType_fullUrl",
  },
} as const satisfies Record<SourceType, SourceTypeSettings>;

export const shapes = ["triangle", "ribbon", "banner", "frame"] as const;

export type Shape = (typeof shapes)[number];

export const positions = [
  "left-top",
  "right-top",
  "left-bottom",
  "right-bottom",
] as const;

export type Position = (typeof positions)[number];

export const colorSwatches = [
  "#fa5252",
  "#e64980",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
  "#000000",
  "#ffffff",
] as const;

export const borders = ["none", "solid", "dashed", "dotted"] as const;
export type Border = (typeof borders)[number];

export const iconStyles = ["none", "badge"] as const;
export type IconStyle = (typeof iconStyles)[number];
