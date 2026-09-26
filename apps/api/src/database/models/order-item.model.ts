import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from "sequelize";
import type { Order } from "./order.model.js";

export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: string;
  declare orderId: ForeignKey<Order["id"]>;
  declare productId: string;
  declare productName: string;
  declare variantName: string;
  declare unitPriceCents: number;
  declare quantity: number;
  declare lineTotalCents: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrderItemModel(sequelize: Sequelize): void {
  OrderItem.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      orderId: { type: DataTypes.UUID, allowNull: false },
      productId: { type: DataTypes.STRING(100), allowNull: false },
      productName: { type: DataTypes.STRING(140), allowNull: false },
      variantName: { type: DataTypes.STRING(100), allowNull: false },
      unitPriceCents: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      lineTotalCents: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "order_items", modelName: "OrderItem" },
  );
}
