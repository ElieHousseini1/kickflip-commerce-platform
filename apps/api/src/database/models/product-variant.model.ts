import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from "sequelize";
import type { Product } from "./product.model.js";

export class ProductVariant extends Model<
  InferAttributes<ProductVariant>,
  InferCreationAttributes<ProductVariant>
> {
  declare id: string;
  declare productId: ForeignKey<Product["id"]>;
  declare name: string;
  declare color: string;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProductVariantModel(sequelize: Sequelize): void {
  ProductVariant.init(
    {
      id: { type: DataTypes.STRING(140), primaryKey: true },
      productId: { type: DataTypes.STRING(100), allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      color: { type: DataTypes.STRING(40), allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "product_variants", modelName: "ProductVariant" },
  );
}
