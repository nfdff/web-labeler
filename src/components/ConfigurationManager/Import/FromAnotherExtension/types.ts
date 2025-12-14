export interface EnvMarkerLabel {
  address: string
  color: string // rgba(r,g,b,a) format
  fontSize: string // "auto", "12px", "60px", etc.
  name: string
  position: string // "1", "2", "3", "4", "5"
  uuid: string
}

export type ExtensionType = (typeof SupportedExtensions)[number]
export const SupportedExtensions = ["Environment Marker"]
