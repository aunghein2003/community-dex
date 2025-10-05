import { ConfigKey, DefaultConfigStore } from "@orderly.network/core";
import { MarketsStorageKey } from "./orderly/useMarkets";

export class ExtendedConfigStore extends DefaultConfigStore {
  constructor(init: Partial<Record<ConfigKey, any>>) {
    super(init);
  }

  get<T>(key: ConfigKey): T {
    if (key === MarketsStorageKey) {
      const jsonStr = localStorage.getItem(MarketsStorageKey);
      if (!jsonStr) {
        // get old storage key data
        const oldJsonStr = localStorage.getItem(
          MarketsStorageKey.replace("orderly_", "")
        );
        return oldJsonStr ? JSON.parse(oldJsonStr) : ("" as T);
      }

      return JSON.parse(jsonStr);
    }
    return super.get(key);
  }

  set<T>(key: ConfigKey, value: T): void {
    if (key === MarketsStorageKey) {
      const jsonStr = JSON.stringify(value);
      localStorage.setItem(MarketsStorageKey, jsonStr);
      return;
    }

    super.set(key, value);
  }
}
