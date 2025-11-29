import { Label } from "../../options/types";
import { validationSchema } from "../../options/validationSchema";
import validate from "../../utils/schemaValidator";
import { logger } from "../../utils/logger";

export interface ValidationResult {
  labels: Label[] | null;
  error?: string;
}

export function validateLabels(data: unknown): ValidationResult {
  // Check if data is an array
  if (!Array.isArray(data)) {
    const errorMsg = "The data doesn't contain valid labels array";
    logger.error(errorMsg);
    return { labels: null, error: errorMsg };
  }

  // Validate each label against schema
  for (const item of data) {
    const { result: isValid, messages } = validate(item, validationSchema);
    if (!isValid) {
      const errorMsg = `Validation error: ${messages?.join("; ")}`;
      logger.error(errorMsg);
      return { labels: null, error: errorMsg };
    }
  }

  logger.info(`Successfully validated ${data.length} labels`);
  return { labels: data as Label[], error: undefined };
}
