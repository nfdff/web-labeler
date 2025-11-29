export const nlToBr = (str: string) => str.replace(/\r\n|\r|\n/g, "<br>");

export const isValidHttpUrl = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
