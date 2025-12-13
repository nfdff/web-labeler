import { Button, Group, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import {
  IconEyeOff,
  IconFlask,
  IconForms,
  IconLabel,
  IconPhotoCircle,
} from "@tabler/icons-react"
import FeatureBadge from "../../../FeatureBadge"
import InfoTooltipIcon from "../../../InfoTooltipIcon"
import LabelEditForm from "../../EditForm"
import { LabelEditFormSection } from "../../EditForm/types.ts"
import { LabelListItemSettingsProps } from "./types.ts"

function LabelListItemSettings({ label }: LabelListItemSettingsProps) {
  return (
    <Group gap="xs">
      <Button
        size="xs"
        variant="light"
        leftSection={
          label.iconOnly ? <IconEyeOff size={14} /> : <IconLabel size={14} />
        }
        onClick={(e) => {
          e.stopPropagation()
          modals.open({
            title: label.iconOnly ? "Badge (Icon-Only Mode)" : "Badge",
            size: "auto",
            children: (
              <LabelEditForm
                label={label}
                section={LabelEditFormSection.Badge}
                onSave={() => modals.closeAll()}
              />
            ),
          })
        }}
      >
        Badge
      </Button>
      <Button
        size="xs"
        variant="light"
        leftSection={<IconPhotoCircle size={14} />}
        onClick={(e) => {
          e.stopPropagation()
          modals.open({
            title: (
              <Group gap="md">
                Icon
                <FeatureBadge
                  title="Experimental"
                  text={
                    <>
                      <Text size="sm">
                        This feature is experimental and may not work as
                        expected. If you encounter any issues or have
                        suggestions, please let the developer know.
                      </Text>
                      <Text size="sm">
                        And if you actually enjoy using it — please tell him
                        too, it might just make his day 😊🙏!
                      </Text>
                    </>
                  }
                  color="orange"
                  icon={<IconFlask size={14} />}
                />
              </Group>
            ),
            size: "auto",
            children: (
              <LabelEditForm
                label={label}
                section={LabelEditFormSection.Icon}
                onSave={() => modals.closeAll()}
              />
            ),
          })
        }}
      >
        Icon
      </Button>
      <Button
        size="xs"
        variant="light"
        leftSection={<IconForms size={14} />}
        onClick={(e) => {
          e.stopPropagation()
          modals.open({
            title: (
              <Group gap="xs">
                Rules
                <InfoTooltipIcon label="The label is shown when any single rule matches (OR logic between rows)" />
              </Group>
            ),
            size: "750px",
            children: (
              <LabelEditForm
                label={label}
                section={LabelEditFormSection.Rules}
                onSave={() => modals.closeAll()}
              />
            ),
          })
        }}
      >
        Rules
      </Button>
    </Group>
  )
}

export default LabelListItemSettings
