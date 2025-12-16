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
import { useTranslation } from "@/contexts"

function ConfigurationImport() {
  const [opened, { open, close }] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState<string>("fromFile")
  const { t } = useTranslation()

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
          {t("import_button")}
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
              {t("import_fromFile")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconWorldUpload size={16} stroke={1.5} />}
              onClick={() => handleOpenModal("fromUrl")}
            >
              {t("import_fromUrl")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconBrandChrome size={16} stroke={1.5} />}
              onClick={() => handleOpenModal("fromExtension")}
            >
              {t("import_fromExtension")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Modal opened={opened} onClose={close} title={t("import_title")} size="lg">
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
