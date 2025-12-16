import { SegmentedControl } from "@mantine/core"
import { useTranslation } from "@/contexts"
import { Shape, shapes } from "@/options/constants.ts"
import { useLabelEditFormContext } from "../../formContext.ts"
import { shapeSettings } from "./settings.tsx"
import classes from "./style.module.scss"

const ShapeSwitcher = () => {
  const form = useLabelEditFormContext()
  const { t } = useTranslation()

  return (
    <SegmentedControl
      data={shapes.map((shape) => {
        const shapeTyped = shape as Shape
        return {
          value: shape,
          label: (
            <div className={classes.shapeControlOption}>
              {shapeSettings?.[shapeTyped].icon}
              <span>{t(shapeSettings[shapeTyped].labelKey)}</span>
            </div>
          ),
        }
      })}
      key={form.key("shape")}
      {...form.getInputProps("shape")}
    />
  )
}

export default ShapeSwitcher
