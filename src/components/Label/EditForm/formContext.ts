import { createFormContext } from "@mantine/form"
import { LabelEditFormValues } from "./types.ts"

export const [
  LabelEditFormProvider,
  useLabelEditFormContext,
  useLabelEditForm,
] = createFormContext<LabelEditFormValues>()
