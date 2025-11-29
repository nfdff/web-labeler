export interface FetchJsonFromUrlMessage {
  type: "FETCH_JSON_FROM_URL";
  url: string;
}

export type ExtensionMessage = FetchJsonFromUrlMessage;

export interface FetchJsonFromUrlResponse {
  data: unknown | null;
  error?: string;
}

export interface MessageResponseMap {
  FETCH_JSON_FROM_URL: FetchJsonFromUrlResponse;
}

export type MessageResponse<T extends ExtensionMessage["type"]> =
  MessageResponseMap[T];
