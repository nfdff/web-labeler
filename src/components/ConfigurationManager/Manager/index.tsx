import { Group } from "@mantine/core";
import ConfigurationImport from "../Import";
import ConfigurationExport from "../Export";
import AutoSyncStatus from "../../AutoSyncStatus";
import { ConfigurationManagerProps } from "./types.ts";

function ConfigurationManager({
  labels,
  dispatch,
  urlSync,
}: ConfigurationManagerProps) {
  return (
    <Group>
      <ConfigurationExport labels={labels} />
      <ConfigurationImport labels={labels} dispatch={dispatch} urlSync={urlSync} />
      <AutoSyncStatus urlSync={urlSync} dispatch={dispatch} labels={labels} />
    </Group>
  );
}

export default ConfigurationManager;
