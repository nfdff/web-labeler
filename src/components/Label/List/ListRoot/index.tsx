import { Table, Stack, Tooltip, Checkbox } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";
import LabelListActions from "../ListActions";
import LabelListItem from "../Item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useOptionsContext, useSelectionContext } from "@/contexts";
import { useTranslation } from "@/contexts";

function LabelList() {
  const { t } = useTranslation();
  const { options, dispatch } = useOptionsContext();
  const selection = useSelectionContext();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selection.selectAll(options.labels.map((label) => label.id));
    } else {
      selection.clearSelection();
    }
  };

  const allSelected =
    options.labels.length > 0 &&
    selection.selectedCount === options.labels.length;
  const someSelected = selection.hasSelection && !allSelected;

  return (
    <Stack>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (destination?.index !== undefined) {
            dispatch({
              type: "reorderLabels",
              payload: {
                sourceIndex: source.index,
                destinationIndex: destination.index,
              },
            });
          }
        }}
      >
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                />
              </Table.Th>
              <Table.Th>
                <Tooltip
                  label={t("labelList_tooltip_reorder")}
                  position="top-start"
                >
                  <IconArrowsSort size={14} />
                </Tooltip>
              </Table.Th>
              <Table.Th>{t("labelList_header_name")}</Table.Th>
              <Table.Th>{t("labelList_header_rules")}</Table.Th>
              <Table.Th>{t("labelList_header_settings")}</Table.Th>
              <Table.Th>{t("labelList_header_actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Droppable droppableId="label-list" direction="vertical">
            {(provided) => (
              <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                {!options.labels?.length ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} align="center">
                      {t("labelList_empty")}
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  options.labels.map((label, index) => (
                    <LabelListItem
                      key={label.id}
                      label={label}
                      index={index}
                      isAllActive={options.isActive}
                      isSelected={selection.isSelected(label.id)}
                      onSelect={() => selection.toggleSelection(label.id)}
                    />
                  ))
                )}
                {provided.placeholder}
              </Table.Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      <LabelListActions />
    </Stack>
  );
}

export default LabelList;
