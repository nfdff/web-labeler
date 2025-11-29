import { Button, Group } from "@mantine/core";
import { IconSquareRoundedPlus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import LabelEditForm from "../../EditForm";
import ConfirmationModal from "../../../ConfirmationModal";
import { LabelEditFormSection } from "../../EditForm/types.ts";
import { useOptionsContext, useSelectionContext } from "../../../../contexts";

function LabelListActions() {
  const { dispatch } = useOptionsContext();
  const { selectedIds, clearSelection, hasSelection } = useSelectionContext();

  const handleDelete = () => {
    if (hasSelection) {
      // Delete selected labels
      selectedIds.forEach((id) => {
        dispatch({ type: "deleteLabel", payload: { id } });
      });
      clearSelection();
    } else {
      // Delete all labels
      dispatch({ type: "deleteAllLabels" });
    }
    modals.closeAll();
  };

  return (
    <Group gap="xs" mt="10">
      <Button
        size="xs"
        variant="light"
        leftSection={<IconSquareRoundedPlus size={16} />}
        onClick={() => {
          modals.open({
            title: "New Label",
            size: "auto",
            children: (
              <LabelEditForm
                section={LabelEditFormSection.Badge}
                onSave={() => modals.closeAll()}
              />
            ),
          });
        }}
      >
        Add Label
      </Button>
      {hasSelection && (
        <Button
          size="xs"
          variant="light"
          leftSection={<IconTrash size={14} />}
          onClick={() => {
            modals.open({
              title: "Delete Labels",
              size: "auto",
              children: (
                <ConfirmationModal
                  message={`Are you sure you want to delete ${selectedIds.size} selected label${selectedIds.size > 1 ? "s" : ""}?`}
                  onConfirm={handleDelete}
                  onClose={() => modals.closeAll()}
                />
              ),
            });
          }}
        >
          Delete Selected
        </Button>
      )}
    </Group>
  );
}

export default LabelListActions;
