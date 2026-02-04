import { Button, Divider, Group, Stack, Text } from "@mantine/core"
import { IconHeartFilled } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"
import { URLS } from "@/utils/constants.ts"
import classes from "./styles.module.scss"

const Index = () => {
  const { t } = useTranslation()

  if (!URLS.WRITE_REVIEW) {
    return null
  }

  return (
    <Stack gap="sm" mt="xl">
      <Divider mb={4} />

      <Group gap="xs">
        <Text size="xs">{t("footer_helpful")}</Text>
        <Button
          component="a"
          size="xs"
          variant="subtle"
          href={URLS.WRITE_REVIEW}
          target="_blank"
          rel="noopener noreferrer"
          leftSection={<IconHeartFilled size={16} />}
          className={classes.rateButton}
        >
          {t("footer_rate")}
        </Button>
      </Group>
    </Stack>
  )
}

export default Index
