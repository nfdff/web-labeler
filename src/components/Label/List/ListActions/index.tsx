import { Button, Group } from "@mantine/core"
import { modals } from "@mantine/modals"
import {
  IconLayersIntersect,
  IconSquareRoundedPlus,
  IconTrash,
} from "@tabler/icons-react"
import { useOptionsContext, useSelectionContext } from "@/contexts"
import { useTranslation } from "@/contexts"
import ConfirmationModal from "../../../ConfirmationModal"
import CombineLabelsModal from "../../CombineLabelsModal"
import LabelEditForm from "../../EditForm"
import { LabelEditFormSection } from "../../EditForm/types.ts"

function LabelListActions() {
  const { t } = useTranslation()
  const { options, dispatch } = useOptionsContext()
  const { selectedIds, clearSelection, hasSelection } = useSelectionContext()

  const handleDelete = () => {
    if (hasSelection) {
      // Delete selected labels
      selectedIds.forEach((id) => {
        dispatch({ type: "deleteLabel", payload: { id } })
      })
      clearSelection()
    } else {
      // Delete all labels
      dispatch({ type: "deleteAllLabels" })
    }
    modals.closeAll()
  }

  const handleCombine = (targetLabelId: string) => {
    dispatch({
      type: "combineLabels",
      payload: {
        targetLabelId,
        labelIdsToMerge: Array.from(selectedIds),
      },
    })
    clearSelection()
    modals.closeAll()
  }

  const selectedLabels = options.labels.filter((label) =>
    selectedIds.has(label.id)
  )

  return (
    <Group gap="xs" mt="10">
      <Button
        size="xs"
        variant="light"
        leftSection={<IconSquareRoundedPlus size={16} />}
        onClick={() => {
          modals.open({
            title: t("labelList_newLabel"),
            size: "auto",
            children: (
              <LabelEditForm
                section={LabelEditFormSection.Badge}
                onSave={() => modals.closeAll()}
              />
            ),
          })
        }}
      >
        {t("labelList_addLabel")}
      </Button>
      {hasSelection && (
        <>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconTrash size={14} />}
            onClick={() => {
              modals.open({
                title: t("labelList_deleteLabels"),
                size: "auto",
                children: (
                  <ConfirmationModal
                    message={t("labelList_deleteConfirm_multiple", [
                      selectedIds.size.toString(),
                      selectedIds.size > 1 ? "s" : "",
                    ])}
                    onConfirm={handleDelete}
                    onClose={() => modals.closeAll()}
                  />
                ),
              })
            }}
          >
            {t("common_delete")}
          </Button>
          {selectedIds.size >= 2 && (
            <Button
              size="xs"
              variant="light"
              leftSection={<IconLayersIntersect size={14} />}
              onClick={() => {
                modals.open({
                  title: t("labelList_combineTitle"),
                  size: "sm",
                  children: (
                    <CombineLabelsModal
                      selectedLabels={selectedLabels}
                      onConfirm={handleCombine}
                      onClose={() => modals.closeAll()}
                    />
                  ),
                })
              }}
            >
              {t("labelList_combine")}
            </Button>
          )}
        </>
      )}
    </Group>
  )
}

export default LabelListActions
