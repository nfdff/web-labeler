import { useMemo } from "react";
import {
  detectCloudService,
  transformCloudUrl,
  isDirectDownloadUrl,
  CloudService,
} from "../../../../utils/cloudUrlTransformer.ts";

export interface UseCloudUrlResult {
  cloudService: CloudService;
  transformedUrl: string;
  isAlreadyDirect: boolean;
  hasTransformation: boolean;
}

export function useCloudUrl(url: string): UseCloudUrlResult {
  return useMemo(() => {
    const cloudService = detectCloudService(url);
    const transformedUrl = cloudService ? transformCloudUrl(url) : url;
    const isAlreadyDirect = cloudService
      ? isDirectDownloadUrl(url, cloudService)
      : false;

    return {
      cloudService,
      transformedUrl,
      isAlreadyDirect,
      hasTransformation: cloudService !== null && !isAlreadyDirect,
    };
  }, [url]);
}
