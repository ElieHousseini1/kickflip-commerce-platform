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
import type { ProductVariant } from "./product-variant.model.js";
import type { User } from "./user.model.js";

export class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare userId: ForeignKey<User["id"]>;
  declare productId: ForeignKey<Product["id"]>;
  declare variantId: ForeignKey<ProductVariant["id"]>;
  declare quantity: number;
  declare product?: NonAttribute<Product>;
  declare selectedVariant?: NonAttribute<ProductVariant>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCartItemModel(sequelize: Sequelize): void {
  CartItem.init(
    {
      userId: { type: DataTypes.UUID, primaryKey: true },
      productId: { type: DataTypes.STRING(100), primaryKey: true },
      variantId: { type: DataTypes.STRING(140), primaryKey: true },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 99 },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "cart_items", modelName: "CartItem" },
  );
}
