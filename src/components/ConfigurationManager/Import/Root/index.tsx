import { Button, Modal } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { ConfigurationImportProps } from "./types.ts";
import ConfigurationImportTabs from "../Tabs";
import { useDisclosure } from "@mantine/hooks";

function ConfigurationImport({
  dispatch,
  labels,
  urlSync,
}: ConfigurationImportProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        variant="default"
        size="xs"
        leftSection={<IconUpload size={16} />}
        onClick={open}
      >
        Import Labels
      </Button>
      <Modal opened={opened} onClose={close} title="Import Labels">
        <ConfigurationImportTabs
          labels={labels}
          dispatch={dispatch}
          urlSync={urlSync}
          closeConfigurationManager={close}
        />
      </Modal>
    </>
  );
}

export default ConfigurationImport;
