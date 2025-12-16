import { Stack, Switch } from "@mantine/core"
import { useLabelEditFormContext } from "../../formContext"
import { useTranslation } from "@/contexts"

function IconOnlyToggle() {
  const form = useLabelEditFormContext()
  const { t } = useTranslation()

  return (
    <Stack gap="xs">
      <Switch
        label={t("label_iconOnlyMode")}
        description={t("label_iconOnlyMode_description")}
        disabled={form.values.iconStyle === "none"}
        checked={form.values.iconOnly || false}
        onChange={(event) =>
          form.setFieldValue("iconOnly", event.currentTarget.checked)
        }
      />
    </Stack>
  )
}

export default IconOnlyToggle
