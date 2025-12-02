export type CloudService = "google-drive" | "onedrive" | "dropbox" | null;

export function detectCloudService(url: string): CloudService {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes("drive.google.com")) return "google-drive";
    if (
      hostname.includes("onedrive.live.com") ||
      hostname.includes("sharepoint.com")
    )
      return "onedrive";
    if (
      hostname.includes("dropbox.com") ||
      hostname.includes("dropboxusercontent.com")
    )
      return "dropbox";

    return null;
  } catch {
    return null;
  }
}

export function transformCloudUrl(url: string): string {
  const service = detectCloudService(url);
  if (!service) return url;

  switch (service) {
    case "google-drive":
      return transformGoogleDriveUrl(url);
    case "onedrive":
      return transformOneDriveUrl(url);
    case "dropbox":
      return transformDropboxUrl(url);
    default:
      return url;
  }
}

function transformGoogleDriveUrl(url: string): string {
  // Already direct download?
  if (url.includes("/uc?") && url.includes("export=download")) {
    return url;
  }

  // Extract file ID from sharing URL
  // Pattern: https://drive.google.com/file/d/FILE_ID/view
  const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return url;
}

function transformDropboxUrl(url: string): string {
  // Already direct download?
  if (url.includes("dl=1") || url.includes("dropboxusercontent.com")) {
    return url;
  }

  // Transform dl=0 to dl=1
  if (url.includes("dl=0")) {
    return url.replace("dl=0", "dl=1");
  }

  // Add dl=1 if not present
  if (url.includes("dropbox.com/s/")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}dl=1`;
  }

  return url;
}

function transformOneDriveUrl(url: string): string {
  // OneDrive transformation is more complex
  // Simplest approach: replace 'redir' with 'download'
  if (url.includes("onedrive.live.com")) {
    return url.replace("/redir?", "/download?");
  }

  // SharePoint: add download=1
  if (url.includes("sharepoint.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}download=1`;
  }

  return url;
}

export function isDirectDownloadUrl(
  url: string,
  service: CloudService,
): boolean {
  if (!service) return false;

  switch (service) {
    case "google-drive":
      return url.includes("/uc?") && url.includes("export=download");
    case "dropbox":
      return url.includes("dl=1") || url.includes("dropboxusercontent.com");
    case "onedrive":
      return url.includes("/download") || url.includes("download=1");
    default:
      return false;
  }
}
