import { Label } from "@/options/types.ts";

export interface LabelEditFormProps {
  onSave?: () => void;
  label?: Label;
  section: LabelEditFormSection;
}

export type LabelEditFormValues = Omit<Label, "id" | "isActive">;

export enum LabelEditFormSection {
  Badge,
  Icon,
  Rules,
}
