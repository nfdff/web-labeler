import { Alert, Group, Switch, Text } from "@mantine/core"
import { IconEyeOff } from "@tabler/icons-react"
import { useLabelEditFormContext } from "../../formContext"
import classes from "./styles.module.scss"

function IconOnlyAlert() {
  const form = useLabelEditFormContext()

  return (
    <Alert
      icon={<IconEyeOff size={14} />}
      title={
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Text size="sm" fw="700">
            Icon-Only Mode
          </Text>
          <Switch
            size="xs"
            color="orange"
            checked={form.values.iconOnly || false}
            onChange={(event) =>
              form.setFieldValue("iconOnly", event.currentTarget.checked)
            }
          />
        </Group>
      }
      color="orange"
      variant="light"
      classNames={{
        body: classes.alertBody,
        label: classes.alertLabel,
      }}
    >
      <Text size="sm">
        The on-page badge is hidden. Only the badged favicon is shown.
      </Text>
    </Alert>
  )
}

export default IconOnlyAlert
