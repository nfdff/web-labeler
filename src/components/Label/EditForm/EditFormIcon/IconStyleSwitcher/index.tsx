import { SegmentedControl } from "@mantine/core";
import { iconStyles, IconStyle } from "@/options/constants.ts";
import { useTranslation } from "@/contexts";
import { useLabelEditFormContext } from "../../formContext.ts";
import { iconStyleSettings } from "./settings.tsx";
import classes from "./style.module.scss";

const Index = () => {
  const form = useLabelEditFormContext();
  const { t } = useTranslation();

  return (
    <SegmentedControl
      data={iconStyles.map((iconStyle) => {
        const iconStyleTyped = iconStyle as IconStyle;
        return {
          value: iconStyle,
          label: (
            <div className={classes.shapeControlOption}>
              {iconStyleSettings?.[iconStyleTyped].icon}
              <span>{t(iconStyleSettings?.[iconStyleTyped].labelKey)}</span>
            </div>
          ),
        };
      })}
      key={form.key("iconStyle")}
      {...form.getInputProps("iconStyle")}
    />
  );
};

export default Index;
