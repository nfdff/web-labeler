import { Label } from "@/options/types.ts";

export interface IconPreviewProps {
  label: Omit<Label, "isActive" | "id">;
}
