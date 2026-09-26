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
import type { OrderItem } from "./order-item.model.js";
import type { User } from "./user.model.js";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: string;
  declare orderNumber: string;
  declare userId: ForeignKey<User["id"]>;
  declare customerName: string;
  declare email: string;
  declare phone: string | null;
  declare address: string;
  declare apartment: string | null;
  declare city: string;
  declare postalCode: string;
  declare country: string;
  declare deliveryMethod: "ship" | "pickup";
  declare paymentMethod: string;
  declare subtotalCents: number;
  declare shippingCents: number;
  declare totalCents: number;
  declare status: CreationOptional<string>;
  declare items?: NonAttribute<OrderItem[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrderModel(sequelize: Sequelize): void {
  Order.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      orderNumber: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      customerName: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      address: { type: DataTypes.STRING(200), allowNull: false },
      apartment: { type: DataTypes.STRING(200), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: false },
      postalCode: { type: DataTypes.STRING(30), allowNull: false },
      country: { type: DataTypes.STRING(100), allowNull: false },
      deliveryMethod: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "ship",
      },
      paymentMethod: { type: DataTypes.STRING(40), allowNull: false },
      subtotalCents: { type: DataTypes.INTEGER, allowNull: false },
      shippingCents: { type: DataTypes.INTEGER, allowNull: false },
      totalCents: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: "confirmed",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "orders", modelName: "Order" },
  );
}
