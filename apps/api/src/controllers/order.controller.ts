import type { Request, Response } from "express";
import type { CheckoutInput } from "../contracts/checkout.contract.js";
import { authenticatedUserId } from "../security/authenticated-user.js";
import { orderService } from "../services/order.service.js";

export const orderController = {
  create: async (
    request: Request<Record<string, string>, object, CheckoutInput>,
    response: Response,
  ) => {
    response.status(201).json({
      order: await orderService.create(
        authenticatedUserId(request),
        request.body,
      ),
    });
  },
};
