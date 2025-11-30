import { Group } from "@mantine/core";
import ConfigurationImport from "../Import";
import ConfigurationExport from "../Export";
import AutoSyncStatus from "../../AutoSyncStatus";

function ConfigurationManager() {
  return (
    <Group>
      <ConfigurationExport />
      <ConfigurationImport />
      <AutoSyncStatus />
    </Group>
  );
}

export default ConfigurationManager;
