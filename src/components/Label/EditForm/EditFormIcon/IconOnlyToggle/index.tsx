import { Stack, Switch } from "@mantine/core"
import { useLabelEditFormContext } from "../../formContext"

function IconOnlyToggle() {
  const form = useLabelEditFormContext()

  return (
    <Stack gap="xs">
      <Switch
        label="Icon-Only Mode"
        description="Hide the on-page badge and show only the icon"
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
