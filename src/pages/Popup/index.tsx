import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { LabelListCompact } from "@/components/Label/List";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";
import { matchLabel, isChromeUrl } from "@/utils/labelMatching";
import { Label } from "@/options/types";
import PopupAddRule from "./components/PopupAddRule";
import PopupMatchedLabel from "./components/PopupMatchedLabel";

function Popup() {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [matchedLabel, setMatchedLabel] = useState<Label | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current tab URL on mount and when options change
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "";
      setCurrentUrl(url);

      // Match label if URL is not a chrome URL
      // Ignore active states in popup - show all matching labels
      if (!isChromeUrl(url)) {
        const matched = matchLabel(options, url, false, false);
        setMatchedLabel(matched);
      } else {
        setMatchedLabel(null);
      }

      setIsLoading(false);
    });
  }, [options]);

  // Render content based on current state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      );
    }

    // View 1: Chrome URLs or empty - show compact list
    if (isChromeUrl(currentUrl)) {
      return <LabelListCompact />;
    }

    // View 3: URL matches a label
    if (matchedLabel) {
      return (
        <PopupMatchedLabel label={matchedLabel} currentUrl={currentUrl} />
      );
    }

    // View 2: URL doesn't match - show add rule form
    return <PopupAddRule currentUrl={currentUrl} />;
  };

  return (
    <Container p={12}>
      <Stack gap={12}>
        {/* Header - always shown */}
        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap" gap={6}>
            <Image src="/icon/icon-16.png" w={16} h={16} />
            <Title order={1} size="h5">
              {t("popup_title")}
            </Title>
          </Group>
          <Group wrap="nowrap" gap={6}>
            <Switch
              size="xs"
              onLabel={t("popup_switchOn")}
              offLabel={t("popup_switchOff")}
              checked={options.isActive}
              onChange={() => {
                dispatch({ type: "toggleActive" });
              }}
            />
          </Group>
        </Group>

        {/* Conditional content */}
        {renderContent()}

        {/* Footer - always shown */}
        <Button
          size="xs"
          fullWidth
          variant="default"
          leftSection={<IconSettings size={14} />}
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        >
          {t("popup_manageLabels")}
        </Button>
      </Stack>
    </Container>
  );
}

export default Popup;
