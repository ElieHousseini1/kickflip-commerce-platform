import { DataTypes, Sequelize } from "sequelize";
import type { Migration } from "./migration.js";

const timestamps = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
};

export const initialSchema: Migration = {
  id: "001_initial_schema",
  async up(queryInterface, transaction) {
    await queryInterface.createTable(
      "users",
      {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING, allowNull: false },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "products",
      {
        id: { type: DataTypes.STRING(100), primaryKey: true, allowNull: false },
        slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(140), allowNull: false },
        category: { type: DataTypes.STRING(80), allowNull: false },
        price_cents: { type: DataTypes.INTEGER, allowNull: false },
        stock_quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        description: { type: DataTypes.TEXT, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: false },
        variant_name: { type: DataTypes.STRING(80), allowNull: false },
        badge: { type: DataTypes.STRING(80), allowNull: true },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "product_variants",
      {
        id: { type: DataTypes.STRING(140), primaryKey: true, allowNull: false },
        product_id: {
          type: DataTypes.STRING(100),
          allowNull: false,
          references: { model: "products", key: "id" },
          onDelete: "CASCADE",
        },
        name: { type: DataTypes.STRING(100), allowNull: false },
        color: { type: DataTypes.STRING(40), allowNull: false },
        sort_order: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "cart_items",
      {
        user_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
        },
        product_id: {
          type: DataTypes.STRING(100),
          primaryKey: true,
          allowNull: false,
          references: { model: "products", key: "id" },
          onDelete: "CASCADE",
        },
        variant_id: {
          type: DataTypes.STRING(140),
          primaryKey: true,
          allowNull: false,
          references: { model: "product_variants", key: "id" },
          onDelete: "CASCADE",
        },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "wishlist_items",
      {
        user_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
        },
        product_id: {
          type: DataTypes.STRING(100),
          primaryKey: true,
          allowNull: false,
          references: { model: "products", key: "id" },
          onDelete: "CASCADE",
        },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "orders",
      {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        order_number: {
          type: DataTypes.STRING(40),
          allowNull: false,
          unique: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
        },
        customer_name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(254), allowNull: false },
        address: { type: DataTypes.STRING(200), allowNull: false },
        city: { type: DataTypes.STRING(100), allowNull: false },
        postal_code: { type: DataTypes.STRING(30), allowNull: false },
        country: { type: DataTypes.STRING(100), allowNull: false },
        payment_method: { type: DataTypes.STRING(40), allowNull: false },
        subtotal_cents: { type: DataTypes.INTEGER, allowNull: false },
        shipping_cents: { type: DataTypes.INTEGER, allowNull: false },
        total_cents: { type: DataTypes.INTEGER, allowNull: false },
        status: {
          type: DataTypes.STRING(40),
          allowNull: false,
          defaultValue: "confirmed",
        },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.createTable(
      "order_items",
      {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
        order_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "orders", key: "id" },
          onDelete: "CASCADE",
        },
        product_id: { type: DataTypes.STRING(100), allowNull: false },
        product_name: { type: DataTypes.STRING(140), allowNull: false },
        variant_name: { type: DataTypes.STRING(100), allowNull: false },
        unit_price_cents: { type: DataTypes.INTEGER, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        line_total_cents: { type: DataTypes.INTEGER, allowNull: false },
        ...timestamps,
      },
      { transaction },
    );

    await queryInterface.addIndex("product_variants", ["product_id"], {
      transaction,
    });
    await queryInterface.addIndex("orders", ["user_id"], { transaction });
  },
  async down(queryInterface, transaction) {
    await queryInterface.dropTable("order_items", { transaction });
    await queryInterface.dropTable("orders", { transaction });
    await queryInterface.dropTable("wishlist_items", { transaction });
    await queryInterface.dropTable("cart_items", { transaction });
    await queryInterface.dropTable("product_variants", { transaction });
    await queryInterface.dropTable("products", { transaction });
    await queryInterface.dropTable("users", { transaction });
  },
};
