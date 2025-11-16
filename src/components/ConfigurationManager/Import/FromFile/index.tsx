import { Text, Stack, Group, List } from "@mantine/core";
import { IconUpload, IconX, IconFileCode } from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { ConfigurationImportFromFilesProps } from "./types.ts";
import ErrorMessage from "../ErrorMessage";
import { useConfigurationFileReader } from "../../../../hooks/useConfigurationReader";
import { modals } from "@mantine/modals";
import ConfirmationModal from "../../../ConfirmationModal";

function ConfigurationImportFromFile({
  labels,
  dispatch,
  closeConfigurationManager,
}: ConfigurationImportFromFilesProps) {
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationFileReader();

  const onFileDrop = async (files: FileWithPath[]) => {
    const labelsForImport = await readAndValidate(files[0]);

    if (labelsForImport) {
      const updatingLabelCount = labelsForImport.filter(
        (labelForImport) =>
          !!labels.find((label) => label.id === labelForImport.id),
      ).length;
      const newLabelsCount = labelsForImport.length - updatingLabelCount;

      modals.open({
        title: "Import labels",
        size: "auto",
        children: (
          <ConfirmationModal
            message={
              <>
                From the imported file:
                <List size="sm" mt={5} mb={5} withPadding>
                  <List.Item>
                    {newLabelsCount}
                    {" new " + (newLabelsCount === 1 ? " label " : "labels ")}
                    will be added;
                  </List.Item>
                  <List.Item>
                    {updatingLabelCount}
                    {" existing " +
                      (updatingLabelCount === 1 ? "label " : "labels ")}
                    will be updated.
                  </List.Item>
                </List>
                Do you want to proceed?
              </>
            }
            onConfirm={() => {
              dispatch({
                type: "mergeLabels",
                payload: { labels: labelsForImport },
              });
              if (closeConfigurationManager) {
                closeConfigurationManager();
              }
              modals.closeAll();
            }}
            onClose={() => modals.closeAll()}
          />
        ),
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
