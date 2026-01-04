import { Label } from "@/options/types"
import { validationSchema } from "@/options/validationSchema"
import { validate } from "./validators"

export function validateLabelsArray(labels: Label[]): void {
  for (const item of labels) {
    const { result: isValid, messages } = validate(
      item as unknown as Record<string, unknown>,
      validationSchema
    )
    if (!isValid) {
      throw new Error(messages?.join("; "))
    }
  }
}
