import { validate } from "./schemaValidator/validators.ts";
import { validationSchema } from "@/options/validationSchema.ts";
import { Label } from "@/options/types.ts";

export function validateLabelsArray(labels: Label[]): void {
  for (const item of labels) {
    const { result: isValid, messages } = validate(
      item as unknown as Record<string, unknown>,
      validationSchema,
    );
    if (!isValid) {
      throw new Error(messages?.join("; "));
    }
  }
}
