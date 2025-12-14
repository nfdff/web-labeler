import { useState } from "react"
import { ActionIcon, Button, Group, Menu, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconBrandChrome,
  IconChevronDown,
  IconFileImport,
  IconUpload,
  IconWorldUpload,
} from "@tabler/icons-react"
import ConfigurationImportTabs from "../Tabs"
import classes from "./styles.module.scss"

function ConfigurationImport() {
  const [opened, { open, close }] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState<string>("fromFile")

  const handleOpenModal = (tab?: string) => {
    if (tab) {
      setActiveTab(tab)
    }
    open()
  }

  return (
    <>
      <Group wrap="nowrap" gap={0}>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconUpload size={16} />}
          onClick={() => handleOpenModal()}
          className={classes.button}
        >
          Import Labels
        </Button>
        <Menu
          transitionProps={{ transition: "pop-top-right" }}
          position="bottom-end"
          withinPortal
        >
          <Menu.Target>
            <ActionIcon
              variant="default"
              size={30}
              className={classes.menuControl}
            >
              <IconChevronDown size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconFileImport size={16} stroke={1.5} />}
              onClick={() => handleOpenModal("fromFile")}
            >
              From file
            </Menu.Item>
            <Menu.Item
              leftSection={<IconWorldUpload size={16} stroke={1.5} />}
              onClick={() => handleOpenModal("fromUrl")}
            >
              From URL
            </Menu.Item>
            <Menu.Item
              leftSection={<IconBrandChrome size={16} stroke={1.5} />}
              onClick={() => handleOpenModal("fromExtension")}
            >
              From Another Extension
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Modal opened={opened} onClose={close} title="Import Labels" size="lg">
        <ConfigurationImportTabs
          closeConfigurationManager={close}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value || "fromFile")}
        />
      </Modal>
    </>
  )
}

export default ConfigurationImport
