const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

export function getAssetUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.replace(/^\/+/, "");
  const assetPath = normalizedPath.startsWith("assets/")
    ? normalizedPath
    : `assets/${normalizedPath}`;
  return `${apiBaseUrl}/${assetPath}`;
}
