import { Group } from "@mantine/core";
import ConfigurationImport from "../Import";
import ConfigurationExport from "../Export";
import { ConfigurationManagerProps } from "./types.ts";

function ConfigurationManager({ labels, dispatch }: ConfigurationManagerProps) {
  return (
    <Group>
      <ConfigurationExport />
      <ConfigurationImport labels={labels} dispatch={dispatch} />
    </Group>
  );
}

export default ConfigurationManager;
