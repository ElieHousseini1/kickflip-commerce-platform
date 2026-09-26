import type { Request, Response } from "express";
import type { WishlistItemInput } from "../contracts/wishlist.contract.js";
import { authenticatedUserId } from "../security/authenticated-user.js";
import { wishlistService } from "../services/wishlist.service.js";

export const wishlistController = {
  list: async (request: Request, response: Response) => {
    response.json({
      products: await wishlistService.list(authenticatedUserId(request)),
    });
  },

  add: async (
    request: Request<Record<string, string>, object, WishlistItemInput>,
    response: Response,
  ) => {
    response.status(201).json({
      products: await wishlistService.add(
        authenticatedUserId(request),
        request.body,
      ),
    });
  },

  remove: async (
    request: Request<Record<string, string>, object, WishlistItemInput>,
    response: Response,
  ) => {
    response.json({
      products: await wishlistService.remove(
        authenticatedUserId(request),
        request.body,
      ),
    });
  },
};
