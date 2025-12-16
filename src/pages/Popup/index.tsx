import {
  Button,
  Container,
  Group,
  Image,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { LabelListCompact } from "@/components/Label/List";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";

function Popup() {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();

  return (
    <Container p={15}>
      <Stack gap="xl">
        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap" gap="xs">
            <Image src="/icon/icon-16.png" />
            <Title order={1} size="h5">
              {t("popup_title")}
            </Title>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <Switch
              size="sm"
              onLabel={t("popup_switchOn")}
              offLabel={t("popup_switchOff")}
              checked={options.isActive}
              onChange={() => {
                dispatch({ type: "toggleActive" });
              }}
            />
          </Group>
        </Group>

        <LabelListCompact />
        <Group gap="xs">
          <Button
            size="xs"
            fullWidth
            variant="default"
            leftSection={<IconSettings size={16} />}
            onClick={() => {
              chrome.runtime.openOptionsPage();
            }}
          >
            {t("popup_manageLabels")}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Popup;
