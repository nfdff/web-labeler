import { Badge, Group, Stack, Switch } from "@mantine/core";
import { useOptionsContext } from "../../../../contexts";

function LabelListCompact() {
  const { options, dispatch } = useOptionsContext();

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
              {label.name || "[noname]"}
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
