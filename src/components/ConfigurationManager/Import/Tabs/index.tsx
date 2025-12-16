import { Tabs } from "@mantine/core"
import {
  IconBrandChrome,
  IconFileImport,
  IconWorldUpload,
} from "@tabler/icons-react"
import ConfigurationImportFromAnotherExtension from "../FromAnotherExtension"
import ConfigurationImportFromFile from "../FromFile"
import ConfigurationImportFromUrl from "../FromUrl"
import { useTranslation } from "@/contexts"

function ConfigurationImportTabs({
  closeConfigurationManager,
  activeTab,
  onTabChange,
}: {
  closeConfigurationManager?: () => void
  activeTab?: string
  onTabChange?: (value: string | null) => void
}) {
  const { t } = useTranslation()

  return (
    <Tabs value={activeTab} onChange={onTabChange} defaultValue="fromFile">
      <Tabs.List mb={20}>
        <Tabs.Tab value="fromFile" leftSection={<IconFileImport size={16} />}>
          {t("importTab_fromFile")}
        </Tabs.Tab>
        <Tabs.Tab value="fromUrl" leftSection={<IconWorldUpload size={16} />}>
          {t("importTab_fromUrl")}
        </Tabs.Tab>
        <Tabs.Tab
          value="fromExtension"
          leftSection={<IconBrandChrome size={16} />}
        >
          {t("importTab_fromExtension")}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="fromFile">
        <ConfigurationImportFromFile
          closeConfigurationManager={closeConfigurationManager}
        />
      </Tabs.Panel>

      <Tabs.Panel value="fromUrl">
        <ConfigurationImportFromUrl
          closeConfigurationManager={closeConfigurationManager}
        />
      </Tabs.Panel>

      <Tabs.Panel value="fromExtension">
        <ConfigurationImportFromAnotherExtension
          closeConfigurationManager={closeConfigurationManager}
        />
      </Tabs.Panel>
    </Tabs>
  )
}

export default ConfigurationImportTabs
