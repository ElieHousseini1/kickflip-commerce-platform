import { Asset } from "../database/models/index.js";

export const assetRepository = {
  findByKey(key: string): Promise<Asset | null> {
    return Asset.findByPk(key);
  },
};
