import { ReactNode } from "react"
import { IconLabel } from "@tabler/icons-react"
import { MessageKey } from "@/i18n"
import { IconStyle } from "@/options/constants.ts"

export const iconStyleSettings = {
  none: {
    icon: "",
    labelKey: "label_iconStyle_none" as MessageKey,
  },
  badge: {
    icon: <IconLabel />,
    labelKey: "label_iconStyle_badge" as MessageKey,
  },
} as const satisfies Record<IconStyle, IconStyleSettings>

export interface IconStyleSettings {
  icon: ReactNode
  labelKey: MessageKey
}
