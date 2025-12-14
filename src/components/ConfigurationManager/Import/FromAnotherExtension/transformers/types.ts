import { Label } from "../../../../../options/types.ts";
import { EnvMarkerLabel } from "../types.ts";

export type TransformerFunction = (data: EnvMarkerLabel[]) => Label[];
