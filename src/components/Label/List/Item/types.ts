import { Label } from "@/options/types.ts";

export interface LabelListItemProps {
  label: Label;
  index: number;
  isAllActive?: boolean;
  isSelected: boolean;
  onSelect: (index: number, ctrlKey: boolean, shiftKey: boolean) => void;
}
