import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type { Product } from "./product.model.js";
import type { User } from "./user.model.js";

export class WishlistItem extends Model<
  InferAttributes<WishlistItem>,
  InferCreationAttributes<WishlistItem>
> {
  declare userId: ForeignKey<User["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare product?: NonAttribute<Product>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initWishlistItemModel(sequelize: Sequelize): void {
  WishlistItem.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true },
      productId: { type: DataTypes.STRING(100), primaryKey: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "wishlist_items", modelName: "WishlistItem" },
  );
}
