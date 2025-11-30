import { Button, Modal } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import ConfigurationImportTabs from "../Tabs";
import { useDisclosure } from "@mantine/hooks";

function ConfigurationImport() {
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
        <ConfigurationImportTabs closeConfigurationManager={close} />
      </Modal>
    </>
  );
}

export default ConfigurationImport;
