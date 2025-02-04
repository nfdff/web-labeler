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
    rules: isNew ? [] : [{ type: ruleTypes[0], value: "" }],
    hoveredOpacity: 0.5,
    fontSize: 12,
    scale: 1,
  },
  enhanceGetInputProps: (payload) => ({
    disabled:
      (payload.field === "textColor" ||
        payload.field === "position" ||
        payload.field === "hoveredOpacity" ||
        payload.field === "fontSize") &&
      payload.form.values.shape === "frame",
  }),
  validate: {
    rules: {
      value: (value) =>
        !value.trim().length ? "The rule value can't be empty" : null,
    },
  },
});
