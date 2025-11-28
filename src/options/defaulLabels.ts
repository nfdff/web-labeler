import { Label } from "./types.ts";
import { v4 as uuidv4 } from "uuid";

const defaultLabels: Label[] = [
  {
    id: uuidv4(),
    name: "production",
    bgColor: "#fa5252",
    textColor: "#ffffff",
    opacity: 0.75,
    shape: "triangle",
    position: "left-top",
    rules: [{ type: "contains", value: "yourProduction.com", source: "hostname" }],
    isActive: true,
  },
  {
    id: uuidv4(),
    name: "staging",
    bgColor: "#fd7e14",
    textColor: "#ffffff",
    opacity: 0.75,
    shape: "triangle",
    position: "left-top",
    rules: [{ type: "contains", value: "yourStaging.com", source: "hostname" }],
    isActive: true,
  },
  {
    id: uuidv4(),
    name: "development",
    bgColor: "#82c91e",
    textColor: "#ffffff",
    opacity: 0.75,
    shape: "triangle",
    position: "left-top",
    rules: [{ type: "contains", value: "yourDevelopment.com", source: "hostname" }],
    isActive: true,
  },
];
export default defaultLabels;
