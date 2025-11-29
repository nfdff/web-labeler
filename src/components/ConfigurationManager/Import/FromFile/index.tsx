import { Text, Stack, Group } from "@mantine/core";
import { IconUpload, IconX, IconFileCode } from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { ConfigurationImportFromFilesProps } from "./types.ts";
import ErrorMessage from "../ErrorMessage";
import { useConfigurationFileReader } from "../../../../hooks/useConfigurationReader";
import { useImportLabels } from "../../../../hooks/useImportLabels";

function ConfigurationImportFromFile({
  labels,
  dispatch,
  closeConfigurationManager,
}: ConfigurationImportFromFilesProps) {
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationFileReader();
  const { confirmAndImport } = useImportLabels({
    labels,
    dispatch,
    updateSyncSettings: false,
  });

  const onFileDrop = async (files: FileWithPath[]) => {
    const labelsForImport = await readAndValidate(files[0]);

    if (labelsForImport) {
      confirmAndImport(labelsForImport, {
        title: "Import labels",
        messagePrefix: "From the imported file:",
        onSuccess: () => {
          if (closeConfigurationManager) {
            closeConfigurationManager();
          }
        },
      });
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
        <ErrorMessage
          title="The imported file has syntax errors:"
          message={errorMessage}
        />
      )}
    </>
  );
}

export default ConfigurationImportFromFile;
