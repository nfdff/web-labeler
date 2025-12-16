import { Badge, Checkbox, HoverCard, List, Table } from "@mantine/core"
import { IconGripVertical, IconTag } from "@tabler/icons-react"
import { Draggable } from "@hello-pangea/dnd"
import { useTranslation } from "@/contexts"
import {
  ruleTypeSettings,
  sourceTypeSettings,
} from "@/options/constants.ts"
import LabelListItemActions from "../ItemActions"
import LabelListItemSettings from "../ItemSettings"
import { LabelListItemProps } from "./types.ts"

function LabelListItem({
  label,
  index,
  isAllActive,
  isSelected,
  onSelect,
}: LabelListItemProps) {
  const { t } = useTranslation()

  return (
    <Draggable key={label.id} index={index} draggableId={label.id}>
      {(provided) => (
        <Table.Tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={() => {
            onSelect(isSelected)
          }}
        >
          <Table.Td>
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(e.currentTarget.checked)}
            />
          </Table.Td>
          <Table.Td>
            <div {...provided.dragHandleProps}>
              <IconGripVertical size={14} />
            </div>
          </Table.Td>
          <Table.Td>
            <Badge
              size="md"
              p={12}
              color={label.bgColor}
              style={{ "--badge-color": label.textColor }}
            >
              {label.name || t("common_noname")}
            </Badge>
          </Table.Td>
          <Table.Td>
            <HoverCard shadow="md">
              <HoverCard.Target>
                <Badge size="lg" variant="default" color="gray" radius="xs">
                  {label.rules.length || "-"}
                </Badge>
              </HoverCard.Target>
              {!!label.rules.length && (
                <HoverCard.Dropdown>
                  <List size="xs" icon={<IconTag size={14} />} center>
                    {label.rules.map((rule, idx) => (
                      <List.Item key={idx}>
                        {t(
                          sourceTypeSettings[rule.source || "hostname"].labelKey
                        )}{" "}
                        {t(ruleTypeSettings[rule.type].labelKey)}:{" "}
                        <strong>{rule.value}</strong>
                      </List.Item>
                    ))}
                  </List>
                </HoverCard.Dropdown>
              )}
            </HoverCard>
          </Table.Td>
          <Table.Td>
            <LabelListItemSettings label={label} />
          </Table.Td>
          <Table.Td>
            <LabelListItemActions label={label} isAllActive={isAllActive} />
          </Table.Td>
        </Table.Tr>
      )}
    </Draggable>
  )
}

export default LabelListItem
