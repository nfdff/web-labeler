export const getRuleValuePlaceholder = (type?: string, source?: string) => {
  if (type === "regexp") {
    return "Regexp pattern (e.g., /article/.*)";
  }
  if (source === "fullUrl") {
    return "URL or part (without protocol)";
  }
  return "Domain or part (without protocol)";
};
