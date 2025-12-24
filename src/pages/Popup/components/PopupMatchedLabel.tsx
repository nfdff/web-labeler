import { Badge, Group, Stack, Switch, ActionIcon, Text } from "@mantine/core";
import { IconReplaceFilled } from "@tabler/icons-react";
import { useOptionsContext, useTranslation } from "@/contexts";
import { Label } from "@/options/types";
import { positions } from "@/options/constants";

interface PopupMatchedLabelProps {
  label: Label;
  currentUrl: string;
}

function PopupMatchedLabel({ label }: PopupMatchedLabelProps) {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();

  const handleToggleActive = () => {
    dispatch({
      type: "toggleLabelStatus",
      payload: { id: label.id },
    });
  };

  const handleCyclePosition = () => {
    const currentIndex = positions.indexOf(label.position);
    const nextIndex = (currentIndex + 1) % positions.length;
    const nextPosition = positions[nextIndex];

    const updatedLabel: Label = {
      ...label,
      position: nextPosition,
    };

    dispatch({
      type: "updateLabel",
      payload: { label: updatedLabel },
    });
  };

  const showPositionSwitcher = label.shape !== "frame";

  return (
    <Stack gap={8}>
      <Text size="xs" fw={500} c="dimmed">
        {t("popup_matchedLabel")}
      </Text>

      <Group wrap="nowrap" gap={6} justify="space-between">
        <Badge
          size="sm"
          p={8}
          style={{
            backgroundColor: label.bgColor,
            color: label.textColor,
          }}
        >
          {label.name || t("common_noname")}
        </Badge>

        <Group gap={6} wrap="nowrap">
          {showPositionSwitcher && (
            <ActionIcon
              variant="default"
              size="sm"
              onClick={handleCyclePosition}
              aria-label={t("popup_cyclePosition")}
            >
              <IconReplaceFilled size={14} />
            </ActionIcon>
          )}

          <Switch
            size="xs"
            disabled={!options.isActive}
            checked={label.isActive}
            onChange={handleToggleActive}
          />
        </Group>
      </Group>
    </Stack>
  );
}

export default PopupMatchedLabel;
