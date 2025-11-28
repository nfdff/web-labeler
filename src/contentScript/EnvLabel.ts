import { Label, Options } from "./../options/types";
import { ruleTypes } from "../options/constants";
import StorageChange = chrome.storage.StorageChange;

type subscriberCb = (label: Label | null) => void;

export default class EnvLabel {
  constructor(
    private subscribers: subscriberCb[] = [],
    private label: Label | null = null,
  ) {}

  public async init() {
    chrome.storage.sync.onChanged.addListener(
      this.handleStorageChange.bind(this),
    );

    const { options } = (await chrome.storage.sync.get("options")) as {
      options: Options;
    };

    this.label = this.matchLabel(options);
    this.notifySubscribers();
  }

  private handleStorageChange(changes: { [key: string]: StorageChange }) {
    this.label = this.matchLabel(changes.options.newValue);
    this.notifySubscribers();
  }

  private matchLabel = (options: Options): Label | null => {
    if (
      options?.isActive !== true ||
      !Array.isArray(options?.labels) ||
      options?.labels?.length === 0
    ) {
      return null;
    }

    for (const label of options.labels) {
      if (!label.isActive) {
        continue;
      }
      for (const rule of label.rules) {
        // Get the comparison string based on source (default to hostname for backward compatibility)
        const comparisonString = this.getComparisonString(rule.source);
        if (this.checkRule(rule.type, rule.value, comparisonString)) {
          return label;
        }
      }
    }
    return null;
  };

  private getComparisonString = (
    source?: "hostname" | "fullUrl",
  ): string => {
    // Default to hostname for backward compatibility when source is undefined
    if (!source || source === "hostname") {
      return window.location.hostname;
    }

    // fullUrl: URL without protocol (http:// or https://)
    return window.location.href.replace(/^https?:\/\//, "");
  };

  private checkRule = (
    ruleType: (typeof ruleTypes)[number],
    ruleValue: string,
    str: string,
  ): boolean => {
    switch (ruleType) {
      case "matches":
        return str == ruleValue;
      case "startsWith":
        return str.startsWith(ruleValue);
      case "endsWith":
        return str.endsWith(ruleValue);
      case "contains":
        return str.includes(ruleValue);
      case "regexp":
        try {
          const regex = new RegExp(ruleValue);
          return regex.test(str);
        } catch (e) {
          console.error("Invalid regexp pattern:", ruleValue, e);
          return false;
        }
      default:
        return false;
    }
  };

  public subscribe(callback: subscriberCb) {
    this.subscribers.push(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.label));
  }
}
