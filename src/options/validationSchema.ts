import { Label } from "./types.ts";
import { validate as uuidValidate } from "uuid";
import { isHexColor } from "@/utils/schemaValidator";
import {
  Border,
  borders,
  IconStyle,
  iconStyles,
  Position,
  positions,
  ruleTypes,
  Shape,
  shapes,
} from "./constants.ts";
import { Schema } from "@/utils/schemaValidator";

export const validationSchema: Schema<Label> = {
  id: (val) => typeof val === "string" && uuidValidate(val),
  name: (val) => typeof val === "string",
  bgColor: (val) => typeof val === "string" && isHexColor(val),
  textColor: (val) => typeof val === "string" && isHexColor(val),
  shape: (val) => typeof val === "string" && shapes.includes(val as Shape),
  position: (val) =>
    typeof val === "string" && positions.includes(val as Position),
  rules: (val) =>
    Array.isArray(val) &&
    val.filter(
      (item) =>
        ruleTypes.includes(item?.type) &&
        typeof item?.value === "string" &&
        (item?.source === undefined ||
          item?.source === "hostname" ||
          item?.source === "fullUrl"),
    ).length === val.length,
  opacity: (val) => typeof val === "number" && val > 0 && val < 1,
  isActive: (val) => typeof val === "boolean",
  hoveredOpacity: (val) => typeof val === "number" && val >= 0 && val < 1,
  fontSize: (val) => typeof val === "number" && val >= 10 && val <= 30,
  scale: (val) => typeof val === "number" && val >= 0.5 && val <= 2,
  border: (val) => typeof val === "string" && borders.includes(val as Border),
  borderColor: (val) => typeof val === "string" && isHexColor(val),
  borderWidth: (val) => typeof val === "number" && val >= 0 && val <= 5,
  iconStyle: (val) =>
    typeof val === "string" && iconStyles.includes(val as IconStyle),
  iconOnly: (val) => val === undefined || typeof val === "boolean",
};
