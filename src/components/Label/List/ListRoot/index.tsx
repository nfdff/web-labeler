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
    selection.setLastClickedIndex(null);
  };

  const handleSelect = (clickedIndex: number, ctrlKey: boolean, shiftKey: boolean) => {
    const labelId = options.labels[clickedIndex].id;

    if (shiftKey && selection.lastClickedIndex !== null) {
      // Range selection: replace current selection with range
      const start = Math.min(selection.lastClickedIndex, clickedIndex);
      const end = Math.max(selection.lastClickedIndex, clickedIndex);
      const rangeIds = options.labels
        .slice(start, end + 1)
        .map(label => label.id);
      selection.selectRange(rangeIds);
    } else if (ctrlKey) {
      // Ctrl/Cmd+click: toggle without clearing others
      selection.toggleSelection(labelId);
    } else {
      // Normal click: toggle single item
      selection.toggleSelection(labelId);
    }

    // Update last clicked index for future range selections
    selection.setLastClickedIndex(clickedIndex);
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
            selection.setLastClickedIndex(null);
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
                      onSelect={handleSelect}
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
