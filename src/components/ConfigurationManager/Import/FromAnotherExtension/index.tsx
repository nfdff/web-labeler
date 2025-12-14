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
import { useImportFromExtension } from "../../../../hooks/useImportFromExtension"
import { ExtensionType, SupportedExtensions } from "./types.ts"

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

  const onFileDrop = async (files: FileWithPath[]) => {
    const file = files[0]
    if (!file) return

    await importFromExtension(file, combineMode)

    if (!errorMessage && closeConfigurationManager) {
      closeConfigurationManager()
    }
  }

  return (
    <Stack gap="md">
      <Alert
        color="blue"
        icon={<IconHeartHandshake size={20} stroke={1.25} />}
        variant="light"
        title="This feature helps you migrate your existing labels from other extensions."
      >
        We respect the work of other extension developers and provide this
        option purely as a convenience for users who want to try WebLabeler.
      </Alert>

      <Select
        label="Import From"
        data={SupportedExtensions}
        value={selectedExtension}
        onChange={(value) => setSelectedExtension(value)}
        clearable={false}
      />

      <Switch
        label="Combine labels with matching properties"
        description="Labels with the same name, color, font size, and position will be merged into one label with combined rules. You can also combine labels manually after import."
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
            <Text size="l">Drag file here or click to select</Text>
            <Text size="xs" c="dimmed">
              Use exported labels file from Environment Marker extension in JSON
              format
            </Text>
          </Stack>
        </Group>
      </Dropzone>

      {!!errorMessage && (
        <Alert
          color="red"
          title="Failed to import labels"
          icon={<IconAlertCircle size={16} />}
        >
          {errorMessage}
        </Alert>
      )}
    </Stack>
  )
}

export default ConfigurationImportFromAnotherExtension
