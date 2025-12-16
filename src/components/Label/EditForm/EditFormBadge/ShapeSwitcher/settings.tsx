import { ReactNode } from "react"
import {
  IconLayoutNavbarFilled,
  IconRibbonHealth,
  IconSquareDashed,
  IconTriangle,
} from "@tabler/icons-react"
import { MessageKey } from "@/i18n"
import { Shape } from "@/options/constants.ts"

export interface ShapeSettings {
  icon: ReactNode
  labelKey: MessageKey
}

export const shapeSettings = {
  triangle: {
    icon: <IconTriangle />,
    labelKey: "label_shape_triangle",
  },
  ribbon: {
    icon: <IconRibbonHealth />,
    labelKey: "label_shape_ribbon",
  },
  banner: {
    icon: <IconLayoutNavbarFilled />,
    labelKey: "label_shape_banner",
  },
  frame: {
    icon: <IconSquareDashed />,
    labelKey: "label_shape_frame",
  },
} as const satisfies Record<Shape, ShapeSettings>
