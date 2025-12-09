import {
  Button,
  CloseButton,
  Group,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { IconRefresh } from "@tabler/icons-react"
import { useOptionsContext } from "../../../../contexts"
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts"
import { SyncAlerts } from "./SyncAlerts.tsx"
import { getCloudIcon, getTooltipText } from "./cloudServiceHelpers.tsx"
import { ICON_SIZE } from "./constants.ts"
import { useCloudUrl } from "./useCloudUrl.ts"
import { useImportFromUrlForm } from "./useImportFromUrlForm.ts"

function ConfigurationImportFromUrl({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void
}) {
  const { options, dispatch } = useOptionsContext()
  const urlSync = options.urlSync

  const {
    form,
    permissionError,
    errorMessage,
    handleClear,
    handleSync,
    handleSaveSettings,
    isLoading,
  } = useImportFromUrlForm({
    urlSync,
    dispatch,
    closeConfigurationManager,
  })

  const { cloudService, hasTransformation } = useCloudUrl(form.values.url)

  return (
    <Stack gap="md">
      <TextInput
        label="URL"
        description="URL to a JSON file containing label configurations"
        placeholder="https://example.com/labels.json"
        {...form.getInputProps("url")}
        leftSection={
          <Tooltip
            label={getTooltipText(cloudService, hasTransformation)}
            position="right"
          >
            {getCloudIcon(cloudService)}
          </Tooltip>
        }
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={handleClear}
            style={{ display: form.values.url ? undefined : "none" }}
          />
        }
      />

      <Input.Wrapper
        label="Auto-Sync"
        description="Automatically update labels from URL at the specified frequency"
        styles={{
          description: { marginBottom: 4 },
        }}
      >
        <Group gap="sm">
          <Select
            data={UPDATE_FREQUENCIES}
            {...form.getInputProps("updateFrequency")}
            allowDeselect={false}
            style={{ flexGrow: 1 }}
          />
          <Switch {...form.getInputProps("enabled", { type: "checkbox" })} />
        </Group>
      </Input.Wrapper>

      {urlSync?.lastUpdate && (
        <Text size="xs" c="dimmed">
          Last synced: {new Date(urlSync.lastUpdate).toLocaleString()}
        </Text>
      )}

      <Group gap="xs">
        <Button
          variant="light"
          size="sm"
          leftSection={<IconRefresh size={ICON_SIZE} />}
          onClick={handleSync}
          disabled={!form.values.url.trim() || isLoading}
          loading={isLoading}
        >
          Sync Now
        </Button>

        <Button
          variant="filled"
          size="sm"
          onClick={handleSaveSettings}
          disabled={!form.isDirty()}
        >
          Save Settings
        </Button>
      </Group>

      <SyncAlerts
        permissionError={permissionError}
        errorMessage={errorMessage}
      />
    </Stack>
  )
}

export default ConfigurationImportFromUrl
