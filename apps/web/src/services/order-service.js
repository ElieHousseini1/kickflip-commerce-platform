import { requestJson } from "@/services/api-client";

export async function placeOrder(delivery) {
  const result = await requestJson("/orders", {
    method: "POST",
    body: JSON.stringify(delivery),
  });
  return result.order;
}
