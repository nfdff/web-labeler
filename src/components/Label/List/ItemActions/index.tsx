import { ActionIcon, Group, Switch } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import ConfirmationModal from "../../../ConfirmationModal";
import { LabelListItemActionsProps } from "./types.ts";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";

function LabelListItemActions({
  label,
  isAllActive,
}: LabelListItemActionsProps) {
  const { dispatch } = useOptionsContext();
  const { t } = useTranslation();

  return (
    <Group gap="xs">
      <Switch
        disabled={!isAllActive}
        checked={label.isActive}
        onChange={(e) => {
          e.stopPropagation();
          dispatch({
            type: "toggleLabelStatus",
            payload: { id: label.id },
          });
        }}
      />
      <ActionIcon
        size="md"
        radius="xl"
        variant="light"
        onClick={(e) => {
          e.stopPropagation();
          modals.open({
            title: t("labelList_deleteLabel"),
            size: "lg",
            children: (
              <ConfirmationModal
                message={t("labelList_deleteConfirm_single", [label.name || t("common_noname")])}
                onConfirm={() => {
                  dispatch({
                    type: "deleteLabel",
                    payload: { id: label.id },
                  });
                  modals.closeAll();
                }}
                onClose={() => modals.closeAll()}
              />
            ),
          });
        }}
      >
        <IconTrash size={14} />
      </ActionIcon>
    </Group>
  );
}

export default LabelListItemActions;
