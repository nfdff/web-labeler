import { Position } from "@/options/constants.ts";
import { CSSProperties, ReactNode } from "react";
import {
  IconArrowUpLeft,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconArrowDownRight,
  IconArrowUp,
  IconArrowRight,
  IconArrowDown,
  IconArrowLeft,
} from "@tabler/icons-react";

export const cornerPositionSettings = {
  "left-top": {
    icon: <IconArrowUpLeft />,
    style: { position: "absolute", top: 0, left: 0 },
  },
  "right-top": {
    icon: <IconArrowUpRight />,
    style: { position: "absolute", top: 0, right: 0 },
  },
  "left-bottom": {
    icon: <IconArrowDownLeft />,
    style: { position: "absolute", bottom: 0, left: 0 },
  },
  "right-bottom": {
    icon: <IconArrowDownRight />,
    style: { position: "absolute", bottom: 0, right: 0 },
  },
} as const satisfies Record<Position, PositionSettings>;

export const sidePositionSettings = {
  "left-top": {
    icon: <IconArrowUp />,
    style: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  "right-top": {
    icon: <IconArrowRight />,
    style: {
      position: "absolute",
      top: "50%",
      right: 0,
      transform: "translateY(-50%)",
    },
  },
  "left-bottom": {
    icon: <IconArrowLeft />,
    style: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
    },
  },
  "right-bottom": {
    icon: <IconArrowDown />,
    style: {
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
} as const satisfies Record<Position, PositionSettings>;

export interface PositionSettings {
  icon: ReactNode;
  style: CSSProperties;
}
