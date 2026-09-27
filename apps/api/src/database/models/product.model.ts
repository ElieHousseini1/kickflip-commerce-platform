import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from "sequelize";
import type { ProductVariant } from "./product-variant.model.js";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: string;
  declare slug: string;
  declare name: string;
  declare category: string;
  declare priceCents: number;
  declare compareAtPriceCents: number | null;
  declare stockQuantity: number;
  declare description: string;
  declare image: string;
  declare variantName: string;
  declare badge: string | null;
  declare variants?: NonAttribute<ProductVariant[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProductModel(sequelize: Sequelize): void {
  Product.init(
    {
      id: { type: DataTypes.STRING(100), primaryKey: true },
      slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(140), allowNull: false },
      category: { type: DataTypes.STRING(80), allowNull: false },
      priceCents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
      compareAtPriceCents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      variantName: { type: DataTypes.STRING(80), allowNull: false },
      badge: { type: DataTypes.STRING(80), allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "products", modelName: "Product" },
  );
}
