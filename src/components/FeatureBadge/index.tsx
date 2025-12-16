import { Alert, Badge, Button, Group, HoverCard, Stack } from "@mantine/core";
import { FeatureBadgeProps } from "./types.ts";
import { IconHeartFilled, IconMessage } from "@tabler/icons-react";
import { URLS } from "@/utils/constants.ts";
import classes from "./styles.module.scss";
import { useTranslation } from "@/contexts";

const Index = ({ title, text, color, icon }: FeatureBadgeProps) => {
  const { t } = useTranslation();

  return (
    <HoverCard shadow="md" width={450} position="bottom-start">
      <HoverCard.Target>
        <Badge size="sm" color={color} variant="light">
          <Group gap="xs">
            <div className={classes.titleIcon}>{icon}</div>
            {title}
          </Group>
        </Badge>
      </HoverCard.Target>
      <HoverCard.Dropdown style={{ padding: 0 }}>
        <Alert variant="light" color={color} title={title} icon={icon}>
          <Stack gap="xs" mb="md">
            {text}
          </Stack>
          <Group gap="xs">
            <Button
              component="a"
              variant="light"
              color={color}
              size="xs"
              href={URLS.CONTACT_DEVELOPER}
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconMessage size={14} />}
              className={classes.feedbackButton}
            >
              {t("featureBadge_contactDeveloper")}
            </Button>
            <Button
              component="a"
              size="xs"
              variant="light"
              color={color}
              href={URLS.WRITE_REVIEW}
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconHeartFilled size={16} />}
              className={classes.feedbackButton}
            >
              {t("featureBadge_rate")}
            </Button>
          </Group>
        </Alert>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default Index;
