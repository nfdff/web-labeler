import { Label, Options } from "@/options/types"
import { matchLabel as matchLabelUtil } from "@/utils/labelMatching"

import StorageChange = chrome.storage.StorageChange

type subscriberCb = (label: Label | null) => void

export default class EnvLabel {
  constructor(
    private subscribers: subscriberCb[] = [],
    private label: Label | null = null
  ) {}

  public async init() {
    chrome.storage.sync.onChanged.addListener(
      this.handleStorageChange.bind(this)
    )

    const { options } = (await chrome.storage.sync.get("options")) as {
      options: Options
    }

    this.label = this.matchLabel(options)
    this.notifySubscribers()
  }

  private handleStorageChange(changes: { [key: string]: StorageChange }) {
    this.label = this.matchLabel(changes.options.newValue)
    this.notifySubscribers()
  }

  private matchLabel = (options: Options): Label | null => {
    return matchLabelUtil(options, window.location.href)
  }

  public subscribe(callback: subscriberCb) {
    this.subscribers.push(callback)
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.label))
  }
}
