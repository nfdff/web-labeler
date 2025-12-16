import {
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Title,
} from "@mantine/core"
import ConfigurationManager from "@/components/ConfigurationManager"
import Footer from "@/components/Footer"
import LabelList from "@/components/Label"
import LanguageSelector from "@/components/LanguageSelector"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { SelectionProvider, useOptionsContext } from "@/contexts"
import { useTranslation } from "@/contexts"
import classes from "./style.module.scss"

function OptionsPage() {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()

  return (
    <Container p={20}>
      <Stack>
        <Group wrap="nowrap" justify="space-between" align="center">
          <Group wrap="nowrap" align="center" gap="xs">
            <Image src="/icon/icon-32.png" />
            <Title order={1} size="h2">
              WebLabeler
            </Title>
          </Group>
          <Group wrap="nowrap" align="center" gap="xs">
            <Switch
              size="lg"
              onLabel={t("optionsPage_switchOn")}
              offLabel={t("optionsPage_switchOff")}
              checked={options.isActive}
              onChange={() => {
                dispatch({ type: "toggleActive" })
              }}
            />
            <ThemeSwitcher />
            <LanguageSelector />
          </Group>
        </Group>
        <SelectionProvider>
          <Paper shadow="xs" p="xl" className={classes.labelListContainer}>
            <LabelList />
          </Paper>
          <ConfigurationManager />
        </SelectionProvider>
        <Footer />
      </Stack>
    </Container>
  )
}

export default OptionsPage
