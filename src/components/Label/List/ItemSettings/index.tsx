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
import { useTranslation } from "@/contexts"

function LabelListItemSettings({ label }: LabelListItemSettingsProps) {
  const { t } = useTranslation()
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
            title: label.iconOnly ? t("labelSettings_badge_iconOnly") : t("labelSettings_badge"),
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
        {t("labelSettings_badge")}
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
                {t("labelSettings_icon")}
                <FeatureBadge
                  title={t("labelSettings_experimental")}
                  text={
                    <>
                      <Text size="sm">
                        {t("labelSettings_experimental_message")}
                      </Text>
                      <Text size="sm">
                        {t("labelSettings_experimental_enjoy")}
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
        {t("labelSettings_icon")}
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
                {t("labelSettings_rules")}
                <InfoTooltipIcon label={t("labelSettings_rules_tooltip")} />
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
        {t("labelSettings_rules")}
      </Button>
    </Group>
  )
}

export default LabelListItemSettings
