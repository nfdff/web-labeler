import { Text, Stack, Group, Alert } from "@mantine/core";
import {
  IconUpload,
  IconX,
  IconFileCode,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useSyncFromFile } from "../../../../hooks/useSyncFromFile";

function ConfigurationImportFromFile({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void;
}) {
  const { syncFromFile, isLoading, errorMessage } = useSyncFromFile();

  const onFileDrop = async (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) return;

    const result = await syncFromFile(file);
    if (result.success && closeConfigurationManager) {
      closeConfigurationManager();
    }
  };

  return (
    <>
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
              Use exported configuration file in JSON format
            </Text>
          </Stack>
        </Group>
      </Dropzone>
      {!!errorMessage && (
        <Alert
          color="red"
          title="Failed to read file"
          icon={<IconAlertCircle size={16} />}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}

export default ConfigurationImportFromFile;
