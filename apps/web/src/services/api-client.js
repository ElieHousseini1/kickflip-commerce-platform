export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

export async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers);
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      body?.error?.message ||
        body?.message ||
        "The request could not be completed.",
      { status: response.status, code: body?.error?.code },
    );
  }

  return body;
}
