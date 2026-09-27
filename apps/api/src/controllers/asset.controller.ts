import type { Request, Response } from "express";
import { assetRepository } from "../repositories/asset.repository.js";

const validAssetKey = /^[a-zA-Z0-9][a-zA-Z0-9/_.-]{0,254}$/;

export const assetController = {
  get: async (request: Request<{ key: string[] }>, response: Response) => {
    const key = request.params.key.join("/");
    if (!validAssetKey.test(key)) {
      response.status(404).json({
        error: { code: "ASSET_NOT_FOUND", message: "Asset not found." },
      });
      return;
    }

    const asset = await assetRepository.findByKey(key);
    if (!asset) {
      response.status(404).json({
        error: { code: "ASSET_NOT_FOUND", message: "Asset not found." },
      });
      return;
    }

    response.set({
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": String(asset.data.length),
      "Content-Type": asset.contentType,
      ETag: asset.etag,
    });
    if (request.fresh) {
      response.status(304).end();
      return;
    }
    response.send(asset.data);
  },
};
