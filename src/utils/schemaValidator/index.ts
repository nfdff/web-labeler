import { Schema } from "./types.ts"
import { validateLabelsArray } from "./validateLabelsArray"
import { isHexColor, validate } from "./validators"

export type { Schema }
export { isHexColor, validateLabelsArray }
export default validate
