import { useEffect, useState } from "react"
import {
  Button,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  Stack,
  Switch,
  Title,
} from "@mantine/core"
import { IconSettings } from "@tabler/icons-react"
import { LabelListCompact } from "@/components/Label/List"
import { useOptionsContext } from "@/contexts"
import { useTranslation } from "@/contexts"
import {
  type LabelMatch,
  isChromeUrl,
  matchLabelWithRule,
} from "@/utils/labelMatching"
import PopupAddRule from "./components/PopupAddRule"
import PopupMatchedLabel from "./components/PopupMatchedLabel"

function Popup() {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()

  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [labelMatch, setLabelMatch] = useState<LabelMatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || ""
      setCurrentUrl(url)

      // Match label if URL is not a chrome URL
      if (!isChromeUrl(url)) {
        const matched = matchLabelWithRule(options, url, false, false)
        setLabelMatch(matched)
      } else {
        setLabelMatch(null)
      }

      setIsLoading(false)
    })
  }, [options])

  // Render content based on current state
  const renderContent = () => {
    if (isLoading) {
      return (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      )
    }

    // View 1: Chrome URLs or empty - show compact list
    if (isChromeUrl(currentUrl)) {
      return <LabelListCompact />
    }

    // View 3: URL matches a label
    if (labelMatch) {
      return (
        <PopupMatchedLabel
          label={labelMatch.label}
          matchedRule={labelMatch.rule}
          currentUrl={currentUrl}
        />
      )
    }

    // View 2: URL doesn't match - show add rule form
    return <PopupAddRule currentUrl={currentUrl} />
  }

  return (
    <Container p={12} w={300}>
      <Stack gap={16}>
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
                dispatch({ type: "toggleActive" })
              }}
            />
          </Group>
        </Group>

        {renderContent()}

        <Divider />

        <Button
          size="xs"
          fullWidth
          variant="default"
          leftSection={<IconSettings size={14} />}
          onClick={() => {
            chrome.runtime.openOptionsPage()
          }}
        >
          {t("popup_manageLabels")}
        </Button>
      </Stack>
    </Container>
  )
}

export default Popup
