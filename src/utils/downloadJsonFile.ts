export function downloadJsonFile(data: unknown, filename: string): void {
  const file = new File([JSON.stringify(data, null, 2)], filename, {
    type: "application/json",
  });

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
