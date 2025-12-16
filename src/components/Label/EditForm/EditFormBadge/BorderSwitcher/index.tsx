import { SegmentedControl } from "@mantine/core"
import { useTranslation } from "@/contexts"
import { Border, borders } from "@/options/constants.ts"
import { useLabelEditFormContext } from "../../formContext.ts"
import { borderSettings } from "./settings.tsx"
import classes from "./style.module.scss"

const BorderSwitcher = () => {
  const form = useLabelEditFormContext()
  const { t } = useTranslation()

  return (
    <SegmentedControl
      data={borders.map((border) => {
        const borderTyped = border as Border
        return {
          value: border,
          label: (
            <div className={classes.borderControlOption}>
              {borderSettings?.[borderTyped].icon}
              <span>{t(borderSettings[borderTyped].labelKey)}</span>
            </div>
          ),
        }
      })}
      key={form.key("border")}
      {...form.getInputProps("border")}
    />
  )
}

export default BorderSwitcher
