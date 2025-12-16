import { useState } from "react"
import { Alert, Group, Select, Stack, Switch, Text } from "@mantine/core"
import { Dropzone, FileWithPath } from "@mantine/dropzone"
import {
  IconAlertCircle,
  IconFileCode,
  IconHeartHandshake,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { useImportFromExtension } from "@/hooks/useImportFromExtension"
import { ExtensionType, SupportedExtensions } from "./types.ts"
import { useTranslation } from "@/contexts"

function ConfigurationImportFromAnotherExtension({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void
}) {
  const [combineMode, setCombineMode] = useState(true)
  const [selectedExtension, setSelectedExtension] =
    useState<ExtensionType | null>(SupportedExtensions[0])
  const { importFromExtension, isLoading, errorMessage } =
    useImportFromExtension()
  const { t } = useTranslation()

  const onFileDrop = async (files: FileWithPath[]) => {
    const file = files[0]
    if (!file) return

    const result = await importFromExtension(file, combineMode)

    if (result.success && closeConfigurationManager) {
      closeConfigurationManager()
    }
  }

  return (
    <Stack gap="md">
      <Alert
        color="blue"
        icon={<IconHeartHandshake size={20} stroke={1.25} />}
        variant="light"
        title={t("importFromExtension_alert_title")}
      >
        {t("importFromExtension_alert_message")}
      </Alert>

      <Select
        label={t("importFromExtension_selectLabel")}
        data={SupportedExtensions}
        value={selectedExtension}
        onChange={(value) => setSelectedExtension(value)}
        allowDeselect={false}
      />

      <Switch
        label={t("importFromExtension_combineMode")}
        description={t("importFromExtension_combineMode_description")}
        checked={combineMode}
        onChange={(event) => setCombineMode(event.currentTarget.checked)}
      />

      <Dropzone
        onDrop={onFileDrop}
        accept={["application/json"]}
        multiple={false}
        loading={isLoading}
      >
        <Group
          gap="md"
          justify="center"
          wrap="nowrap"
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload size={44} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={44} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFileCode size={44} />
          </Dropzone.Idle>
          <Stack gap={0}>
            <Text size="l">{t("importFromExtension_dropzone")}</Text>
            <Text size="xs" c="dimmed">
              {t("importFromExtension_dropzone_description")}
            </Text>
          </Stack>
        </Group>
      </Dropzone>

      {!!errorMessage && (
        <Alert
          color="red"
          title={t("importFromExtension_error_title")}
          icon={<IconAlertCircle size={16} />}
        >
          {errorMessage}
        </Alert>
      )}
    </Stack>
  )
}

export default ConfigurationImportFromAnotherExtension
