import { Position } from "@/options/constants.ts";
import {
  PositionSettings,
  cornerPositionSettings,
  sidePositionSettings,
} from "./settings.tsx";
import { ActionIcon } from "@mantine/core";
import { useLabelEditFormContext } from "../../formContext.ts";
import { PositionControlsProps } from "./types.ts";

const PositionControls = ({ mode }: PositionControlsProps) => {
  const {
    values: { position },
    setValues,
  } = useLabelEditFormContext();

  const handlePositionClick = (position: Position) => () => {
    setValues({ position });
  };

  return (
    <>
      {Object.entries(
        mode === "corners" ? cornerPositionSettings : sidePositionSettings,
      ).map(([key, settings]) => {
        const positionValue = key as Position;
        const { icon, style } = settings as PositionSettings;

        return (
          <ActionIcon
            variant="default"
            style={{
              ...style,
              ...(positionValue === position ? { visibility: "hidden" } : {}),
            }}
            aria-label={`Place label to ${positionValue} position`}
            onClick={handlePositionClick(positionValue)}
          >
            {icon}
          </ActionIcon>
        );
      })}
    </>
  );
};

export default PositionControls;
