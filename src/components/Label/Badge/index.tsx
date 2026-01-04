import { Badge } from "@mantine/core"
import { useTranslation } from "@/contexts"
import { LabelBadgeProps } from "./types.ts"

function LabelBadge({
  label,
  size = "md",
  p = 10,
  fallbackText,
}: LabelBadgeProps) {
  const { t } = useTranslation()

  if (!label) {
    return (
      <Badge size={size} p={p}>
        {fallbackText || t("common_noname")}
      </Badge>
    )
  }

  return (
    <Badge
      size={size}
      p={p}
      style={{
        backgroundColor: label.bgColor,
        color: label.textColor,
      }}
    >
      {label.name || t("common_noname")}
    </Badge>
  )
}

export default LabelBadge
