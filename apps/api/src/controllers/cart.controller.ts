import type { Request, Response } from "express";
import type {
  AddCartItemInput,
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "../contracts/cart.contract.js";
import { authenticatedUserId } from "../security/authenticated-user.js";
import { cartService } from "../services/cart.service.js";

export const cartController = {
  list: async (request: Request, response: Response) => {
    response.json({
      lines: await cartService.list(authenticatedUserId(request)),
    });
  },

  add: async (
    request: Request<Record<string, string>, object, AddCartItemInput>,
    response: Response,
  ) => {
    response.status(201).json({
      lines: await cartService.add(authenticatedUserId(request), request.body),
    });
  },

  update: async (
    request: Request<Record<string, string>, object, UpdateCartItemInput>,
    response: Response,
  ) => {
    response.json({
      lines: await cartService.update(
        authenticatedUserId(request),
        request.body,
      ),
    });
  },

  remove: async (
    request: Request<Record<string, string>, object, RemoveCartItemInput>,
    response: Response,
  ) => {
    response.json({
      lines: await cartService.remove(
        authenticatedUserId(request),
        request.body,
      ),
    });
  },
};
