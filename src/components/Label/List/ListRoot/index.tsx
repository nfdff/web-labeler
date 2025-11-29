import { Table, Stack, Tooltip } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";
import LabelListActions from "../ListActions";
import LabelListItem from "../Item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useOptionsContext } from "../../../../hooks/useOptionsContext";

function LabelList() {
  const { options, dispatch } = useOptionsContext();

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
                <Tooltip
                  label="Drag items to reorder. Labels are checked top-down; the first match is shown"
                  position="top-start"
                >
                  <IconArrowsSort size={14} />
                </Tooltip>
              </Table.Th>
              <Table.Th>Label Name</Table.Th>
              <Table.Th>Rules</Table.Th>
              <Table.Th>Settings</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Droppable droppableId="label-list" direction="vertical">
            {(provided) => (
              <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                {!options.labels?.length ? (
                  <Table.Tr>
                    <Table.Td colSpan={5} align="center">
                      no labels
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  options.labels.map((label, index) => (
                    <LabelListItem
                      key={label.id}
                      label={label}
                      index={index}
                      isAllActive={options.isActive}
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
