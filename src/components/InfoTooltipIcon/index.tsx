import { ActionIcon, Tooltip } from "@mantine/core"
import { IconQuestionMark } from "@tabler/icons-react"
import { InfoTooltipIconProps } from "./types.ts"

function InfoTooltipIcon({ label }: InfoTooltipIconProps) {
  return (
    <Tooltip label={label} position="right">
      <ActionIcon variant="light" color="gray" size="xs" radius="xl">
        <IconQuestionMark size={12} />
      </ActionIcon>
    </Tooltip>
  )
}

export default InfoTooltipIcon
