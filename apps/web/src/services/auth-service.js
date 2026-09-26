import { requestJson } from "@/services/api-client";

export function loginUser(credentials) {
  return requestJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerUser(fields) {
  return requestJson("/auth/register", {
    method: "POST",
    body: JSON.stringify(fields),
  });
}

export function logoutUser() {
  return requestJson("/auth/logout", { method: "POST" });
}
