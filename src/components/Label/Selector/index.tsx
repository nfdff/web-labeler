import { useMemo } from "react"
import { Combobox, InputBase, Text, useCombobox } from "@mantine/core"
import { useTranslation, useOptionsContext } from "@/contexts"
import { getLabelById } from "@/utils/labelHelpers"
import LabelBadge from "../Badge"
import { LabelSelectorComboboxProps } from "./types.ts"

function LabelSelector({
  selectedLabelId,
  onSelect,
  label,
  placeholder,
  size = "xs",
}: LabelSelectorComboboxProps) {
  const { t } = useTranslation()
  const { options } = useOptionsContext()
  const combobox = useCombobox()

  // Find selected label based on prop
  const selectedLabel = useMemo(
    () => getLabelById(options.labels, selectedLabelId),
    [options.labels, selectedLabelId]
  )

  const labels = options.labels

  const defaultLabel = label || t("popup_selectLabel")
  const defaultPlaceholder = placeholder || t("popup_selectLabel_placeholder")

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(value) => {
        onSelect(value)
        combobox.closeDropdown()
      }}
      transitionProps={{ transition: "pop", duration: 200 }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          size={size}
          label={defaultLabel}
          onClick={() => combobox.toggleDropdown()}
          rightSection={<Combobox.Chevron />}
        >
          {selectedLabel ? (
            <LabelBadge label={selectedLabel} size="sm" p={8} />
          ) : (
            <Text size="xs" c="dimmed">
              {defaultPlaceholder}
            </Text>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options style={{ maxHeight: 150, overflowY: "auto" }}>
          {labels.map((labelItem) => (
            <Combobox.Option key={labelItem.id} value={labelItem.id}>
              <LabelBadge label={labelItem} size="sm" />
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default LabelSelector
