import { Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconUpload } from "@tabler/icons-react"
import ConfigurationImportTabs from "../Tabs"

function ConfigurationImport() {
  const [opened, { open, close }] = useDisclosure(false)

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
      <Modal opened={opened} onClose={close} title="Import Labels" size="lg">
        <ConfigurationImportTabs closeConfigurationManager={close} />
      </Modal>
    </>
  )
}

export default ConfigurationImport
