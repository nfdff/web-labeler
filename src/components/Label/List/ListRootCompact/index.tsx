import { Badge, Group, Stack, Switch } from "@mantine/core";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";

function LabelListCompact() {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();

  return (
    !!options.labels.length && (
      <Stack gap="xs">
        {options.labels.map((label) => (
          <Group wrap="nowrap" gap="xs" justify="space-between">
            <Badge
              size="sm"
              p={10}
              color={label.bgColor}
              style={{ "--badge-color": label.textColor }}
            >
              {label.name || t("common_noname")}
            </Badge>
            <Switch
              size="xs"
              disabled={!options.isActive}
              checked={label.isActive}
              onChange={() => {
                dispatch({
                  type: "toggleLabelStatus",
                  payload: { id: label.id },
                });
              }}
            />
          </Group>
        ))}
      </Stack>
    )
  );
}

export default LabelListCompact;
