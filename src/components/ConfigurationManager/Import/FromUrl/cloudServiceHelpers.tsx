import {
  IconBrandDropbox,
  IconBrandGoogleDrive,
  IconBrandOnedrive,
  IconWorldUpload,
} from "@tabler/icons-react";
import { CloudService } from "../../../../utils/cloudUrlTransformer.ts";
import { CLOUD_SERVICE_METADATA, ICON_SIZE } from "./constants.ts";

export function getCloudIcon(service: CloudService) {
  const iconMap = {
    "google-drive": IconBrandGoogleDrive,
    onedrive: IconBrandOnedrive,
    dropbox: IconBrandDropbox,
    generic: IconWorldUpload,
  };

  const IconComponent = iconMap[service];
  return <IconComponent size={ICON_SIZE} />;
}

export function getTooltipText(
  service: CloudService,
  hasTransformation: boolean,
): string {
  if (service === "generic") return "URL to JSON file";

  const serviceName = CLOUD_SERVICE_METADATA[service].name;

  if (hasTransformation) {
    return `${serviceName} URL detected. Will be transformed to direct download link.`;
  }
  return `${serviceName} direct download link detected.`;
}
