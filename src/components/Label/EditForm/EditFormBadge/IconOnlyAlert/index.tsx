import { Alert, Group, Switch, Text } from "@mantine/core"
import { IconEyeOff } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"
import { useLabelEditFormContext } from "../../formContext"
import classes from "./styles.module.scss"

function IconOnlyAlert() {
  const form = useLabelEditFormContext()
  const { t } = useTranslation()

  return (
    <Alert
      icon={<IconEyeOff size={14} />}
      title={
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Text size="sm" fw="700">
            {t("label_iconOnlyMode_alert_title")}
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
        {t("label_iconOnlyMode_alert_message")}
      </Text>
    </Alert>
  )
}

export default IconOnlyAlert
