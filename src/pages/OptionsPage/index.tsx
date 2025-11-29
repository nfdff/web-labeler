import {
  Container,
  Switch,
  Paper,
  Stack,
  Title,
  Group,
  Image,
} from "@mantine/core";
import LabelList from "../../components/Label";
import ConfigurationManager from "../../components/ConfigurationManager";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import classes from "./style.module.scss";
import Footer from "../../components/Footer";
import { useOptionsContext, SelectionProvider } from "../../contexts";

function OptionsPage() {
  const { options, dispatch } = useOptionsContext();

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
              onLabel="On"
              offLabel="Off"
              checked={options.isActive}
              onChange={() => {
                dispatch({ type: "toggleActive" });
              }}
            />
            <ThemeSwitcher />
          </Group>
        </Group>
        <SelectionProvider>
          <Paper shadow="xs" p="xl" className={classes.labelListContainer}>
            <LabelList />
          </Paper>
          <ConfigurationManager labels={options.labels}
                                dispatch={dispatch}
                                urlSync={options.urlSync}
          />
        </SelectionProvider>
        <Footer />
      </Stack>
    </Container>
  );
}

export default OptionsPage;
