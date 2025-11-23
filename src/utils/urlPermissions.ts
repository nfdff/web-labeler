export function getOriginPattern(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/*`;
  } catch {
    return "";
  }
}

export async function requestUrlPermission(url: string): Promise<boolean> {
  const originPattern = getOriginPattern(url);
  if (!originPattern) {
    return false;
  }

  try {
    // Check if we already have permission
    const hasPermission = await chrome.permissions.contains({
      origins: [originPattern],
    });

    if (hasPermission) {
      return true;
    }

    // Request permission
    return await chrome.permissions.request({
      origins: [originPattern],
    });
  } catch (error) {
    console.error("Error requesting permission:", error);
    return false;
  }
}
