import { Text, Stack, Group, Alert } from "@mantine/core";
import {
  IconUpload,
  IconX,
  IconFileCode,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useSyncFromFile } from "@/hooks/useSyncFromFile";
import { useTranslation } from "@/contexts";

function ConfigurationImportFromFile({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void;
}) {
  const { syncFromFile, isLoading, errorMessage } = useSyncFromFile();
  const { t } = useTranslation();

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
            <Text size="l">{t("importFromFile_dropzone")}</Text>
            <Text size="xs" c="dimmed">
              {t("importFromFile_dropzone_description")}
            </Text>
          </Stack>
        </Group>
      </Dropzone>
      {!!errorMessage && (
        <Alert
          color="red"
          title={t("importFromFile_error_title")}
          icon={<IconAlertCircle size={16} />}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}

export default ConfigurationImportFromFile;
