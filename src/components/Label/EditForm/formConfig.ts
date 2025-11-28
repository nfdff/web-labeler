import {
  colorSwatches,
  positions,
  ruleTypes,
  shapes,
} from "../../../options/constants.ts";
import { UseFormInput } from "@mantine/form";
import { LabelEditFormValues } from "./types.ts";

export const editLabelFormInput = (
  isNew: boolean,
): UseFormInput<LabelEditFormValues> => ({
  initialValues: {
    name: "",
    bgColor: colorSwatches[0],
    textColor: colorSwatches[colorSwatches.length - 1],
    opacity: 0.75,
    shape: shapes[0],
    position: positions[0],
    rules: isNew ? [] : [{ type: ruleTypes[0], value: "", source: "hostname" }],
    hoveredOpacity: 0.5,
    fontSize: 12,
    scale: 1,
    border: "none",
    borderColor: colorSwatches[colorSwatches.length - 1],
    borderWidth: 1,
    iconStyle: "badge",
  },
  enhanceGetInputProps: (payload) => ({
    disabled:
      ((payload.field === "textColor" ||
        payload.field === "position" ||
        payload.field === "hoveredOpacity" ||
        payload.field === "fontSize" ||
        payload.field === "border" ||
        payload.field === "borderColor" ||
        payload.field === "borderWidth") &&
        payload.form.values.shape === "frame") ||
      ((payload.field === "borderColor" || payload.field === "borderWidth") &&
        payload.form.values.border === "none"),
  }),
  validate: {
    rules: {
      value: (value, values, path) => {
        if (!value.trim().length) {
          return "The rule value can't be empty";
        }

        // Validate regexp pattern
        const index = parseInt(path.split(".")[1]);
        if (values.rules[index]?.type === "regexp") {
          try {
            new RegExp(value);
          } catch (e) {
            return "Invalid regular expression pattern";
          }
        }

        return null;
      },
    },
  },
});
