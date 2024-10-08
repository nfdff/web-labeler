import { ConfigurationImportTabsProps } from "./types.ts";
import { Tabs } from "@mantine/core";
import { IconFileImport } from "@tabler/icons-react";
import ConfigurationImportFromFile from "../FromFile";

function ConfigurationImportTabs({
  dispatch,
  labels,
}: ConfigurationImportTabsProps) {
  return (
    <Tabs defaultValue="fromFile">
      <Tabs.List mb={20}>
        <Tabs.Tab value="fromFile" leftSection={<IconFileImport size={14} />}>
          From File
        </Tabs.Tab>
        {/*<Tabs.Tab value="fromUrl" leftSection={<IconWorldUpload size={14} />}>*/}
        {/*  From Url*/}
        {/*</Tabs.Tab>*/}
      </Tabs.List>

      <Tabs.Panel value="fromFile">
        <ConfigurationImportFromFile labels={labels} dispatch={dispatch} />
      </Tabs.Panel>

      {/*<Tabs.Panel value="fromUrl">*/}
      {/*  <ConfigurationImportFromUrl />*/}
      {/*</Tabs.Panel>*/}
    </Tabs>
  );
}

export default ConfigurationImportTabs;
