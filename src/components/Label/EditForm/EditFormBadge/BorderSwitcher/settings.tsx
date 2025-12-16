import { ReactNode } from "react"
import { IconLineDashed, IconLineDotted, IconMinus } from "@tabler/icons-react"
import { MessageKey } from "@/i18n"
import { Border } from "@/options/constants.ts"

export interface BorderSettings {
  icon: ReactNode
  labelKey: MessageKey
}

export const borderSettings = {
  none: {
    icon: <></>,
    labelKey: "label_border_none",
  },
  solid: {
    icon: <IconMinus />,
    labelKey: "label_border_solid",
  },
  dashed: {
    icon: <IconLineDashed />,
    labelKey: "label_border_dashed",
  },
  dotted: {
    icon: <IconLineDotted />,
    labelKey: "label_border_dotted",
  },
} as const satisfies Record<Border, BorderSettings>
