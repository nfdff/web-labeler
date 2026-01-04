export interface LabelSelectorComboboxProps {
  selectedLabelId: string
  onSelect: (labelId: string) => void
  label?: string
  placeholder?: string
  size?: "xs" | "sm" | "md"
}
