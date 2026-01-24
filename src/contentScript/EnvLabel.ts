import browser from "webextension-polyfill"
import type { Storage } from "webextension-polyfill"
import { Label, Options } from "@/options/types"
import { matchLabel as matchLabelUtil } from "@/utils/labelMatching"

type subscriberCb = (label: Label | null) => void

export default class EnvLabel {
  constructor(
    private subscribers: subscriberCb[] = [],
    private label: Label | null = null
  ) {}

  public async init() {
    browser.storage.sync.onChanged.addListener(
      this.handleStorageChange.bind(this)
    )

    const { options } = (await browser.storage.sync.get("options")) as {
      options: Options
    }

    this.label = this.matchLabel(options)
    this.notifySubscribers()
  }

  private handleStorageChange(changes: { [key: string]: Storage.StorageChange }) {
    this.label = this.matchLabel(changes.options.newValue as Options)
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
