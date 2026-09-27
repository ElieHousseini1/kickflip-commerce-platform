import type { Sequelize } from "sequelize";
import { Asset, initAssetModel } from "./asset.model.js";
import { CartItem, initCartItemModel } from "./cart-item.model.js";
import { initOrderItemModel, OrderItem } from "./order-item.model.js";
import { initOrderModel, Order } from "./order.model.js";
import { initProductModel, Product } from "./product.model.js";
import {
  initProductVariantModel,
  ProductVariant,
} from "./product-variant.model.js";
import { initUserModel, User } from "./user.model.js";
import { initWishlistItemModel, WishlistItem } from "./wishlist-item.model.js";

let initialized = false;

export function initializeModels(sequelize: Sequelize): void {
  if (initialized) return;

  initUserModel(sequelize);
  initAssetModel(sequelize);
  initProductModel(sequelize);
  initProductVariantModel(sequelize);
  initCartItemModel(sequelize);
  initWishlistItemModel(sequelize);
  initOrderModel(sequelize);
  initOrderItemModel(sequelize);

  Product.hasMany(ProductVariant, {
    as: "variants",
    foreignKey: "productId",
    onDelete: "CASCADE",
  });
  ProductVariant.belongsTo(Product, { as: "product", foreignKey: "productId" });

  CartItem.belongsTo(Product, { as: "product", foreignKey: "productId" });
  CartItem.belongsTo(ProductVariant, {
    as: "selectedVariant",
    foreignKey: "variantId",
  });
  User.hasMany(CartItem, { as: "cartItems", foreignKey: "userId" });

  WishlistItem.belongsTo(Product, { as: "product", foreignKey: "productId" });
  User.hasMany(WishlistItem, { as: "wishlistItems", foreignKey: "userId" });

  Order.hasMany(OrderItem, {
    as: "items",
    foreignKey: "orderId",
    onDelete: "CASCADE",
  });
  OrderItem.belongsTo(Order, { as: "order", foreignKey: "orderId" });
  User.hasMany(Order, { as: "orders", foreignKey: "userId" });

  initialized = true;
}

export {
  Asset,
  CartItem,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  User,
  WishlistItem,
};
