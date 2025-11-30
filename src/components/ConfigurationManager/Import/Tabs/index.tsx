import { Tabs } from "@mantine/core";
import { IconFileImport, IconWorldUpload } from "@tabler/icons-react";
import ConfigurationImportFromFile from "../FromFile";
import ConfigurationImportFromUrl from "../FromUrl";

function ConfigurationImportTabs({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void;
}) {
  return (
    <Tabs defaultValue="fromFile">
      <Tabs.List mb={20}>
        <Tabs.Tab value="fromFile" leftSection={<IconFileImport size={14} />}>
          From File
        </Tabs.Tab>
        <Tabs.Tab value="fromUrl" leftSection={<IconWorldUpload size={14} />}>
          From URL
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
    </Tabs>
  );
}

export default ConfigurationImportTabs;
