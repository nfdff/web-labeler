import { Button } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslation } from "@/contexts";
import { CollapseButtonProps } from "./types.tsx";
import classes from "./style.module.scss";

const CollapseButton = ({ expanded, toggle }: CollapseButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className={classes.CollapseButton}>
      <Button
        variant="default"
        size="xs"
        radius="xl"
        onClick={toggle}
        leftSection={
          expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
        }
      >
        {expanded ? t("label_collapseButton_less") : t("label_collapseButton_more")}
      </Button>
    </div>
  );
};

export default CollapseButton;
