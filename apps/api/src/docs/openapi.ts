import { env } from "../config/env.js";

const jsonRequest = (schema: object) => ({
  required: true,
  content: { "application/json": { schema } },
});

const jsonResponse = (description: string, schema?: object) => ({
  description,
  ...(schema ? { content: { "application/json": { schema } } } : {}),
});

const errorResponse = (description: string) =>
  jsonResponse(description, { $ref: "#/components/schemas/ApiError" });

const sessionSecurity = [{ sessionCookie: [] }];
const productListSchema = {
  type: "object",
  properties: {
    products: {
      type: "array",
      items: { $ref: "#/components/schemas/Product" },
    },
    total: { type: "integer", minimum: 0 },
  },
};
const cartSchema = {
  type: "object",
  properties: {
    lines: {
      type: "array",
      items: { $ref: "#/components/schemas/CartLine" },
    },
  },
};

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Kickflip Supply API",
    version: "1.0.0",
    description:
      "Authenticated commerce API built with Express, TypeScript, Sequelize, and SQLite.",
  },
  servers: [{ url: "http://localhost:4000", description: "Local development" }],
  tags: [
    { name: "Authentication" },
    { name: "Products" },
    { name: "Cart" },
    { name: "Wishlist" },
    { name: "Orders" },
  ],
  components: {
    securitySchemes: {
      sessionCookie: { type: "apiKey", in: "cookie", name: env.COOKIE_NAME },
    },
    schemas: {
      ApiError: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid request body." },
              details: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      User: {
        type: "object",
        required: ["id", "name", "email"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
      Credentials: {
        type: "object",
        required: ["email", "password"],
        additionalProperties: false,
        properties: {
          email: { type: "string", format: "email", maxLength: 254 },
          phone: {
            type: "string",
            pattern: "^\\+961[0-9]{7,8}$",
            example: "+96171441351",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 15,
            maxLength: 200,
            description:
              "At most 72 UTF-8 bytes; must not consist of one repeated character.",
          },
          rememberMe: { type: "boolean", default: false },
        },
      },
      Registration: {
        type: "object",
        required: ["name", "email", "password"],
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 254 },
          password: {
            type: "string",
            format: "password",
            minLength: 15,
            maxLength: 200,
            description:
              "At most 72 UTF-8 bytes; must not consist of one repeated character.",
          },
        },
      },
      ProductVariant: {
        type: "object",
        required: ["id", "name", "color"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          color: { type: "string" },
        },
      },
      Product: {
        type: "object",
        required: [
          "id",
          "slug",
          "name",
          "category",
          "price",
          "stockQuantity",
          "description",
          "image",
          "variantName",
          "variantOptions",
          "colors",
          "variants",
        ],
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          category: { type: "string" },
          price: { type: "number", minimum: 0 },
          compareAtPrice: { type: "number", minimum: 0 },
          stockQuantity: { type: "integer", minimum: 0 },
          description: { type: "string" },
          image: { type: "string" },
          variantName: { type: "string" },
          variantOptions: { type: "array", items: { type: "string" } },
          colors: { type: "array", items: { type: "string" } },
          variants: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductVariant" },
          },
          badge: { type: "string" },
        },
      },
      CartLine: {
        type: "object",
        required: [
          "productId",
          "variantId",
          "quantity",
          "selectedVariant",
          "product",
        ],
        properties: {
          productId: { type: "string" },
          variantId: { type: "string" },
          quantity: { type: "integer", minimum: 1, maximum: 99 },
          selectedVariant: {
            $ref: "#/components/schemas/ProductVariant",
          },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      AddCartItem: {
        type: "object",
        required: ["productId"],
        additionalProperties: false,
        properties: {
          productId: { type: "string" },
          variantId: { type: "string" },
          quantity: { type: "integer", minimum: 1, maximum: 99, default: 1 },
        },
      },
      UpdateCartItem: {
        type: "object",
        required: ["productId", "variantId"],
        additionalProperties: false,
        anyOf: [{ required: ["quantity"] }, { required: ["nextVariantId"] }],
        properties: {
          productId: { type: "string" },
          variantId: { type: "string" },
          nextVariantId: { type: "string" },
          quantity: { type: "integer", minimum: 0, maximum: 99 },
        },
      },
      CartItemIdentity: {
        type: "object",
        required: ["productId", "variantId"],
        additionalProperties: false,
        properties: {
          productId: { type: "string" },
          variantId: { type: "string" },
        },
      },
      WishlistItem: {
        type: "object",
        required: ["productId"],
        additionalProperties: false,
        properties: { productId: { type: "string" } },
      },
      Checkout: {
        type: "object",
        required: ["name", "email"],
        additionalProperties: false,
        description:
          "Shipping requires address, city, postalCode and country. Pickup does not require an address.",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 254 },
          deliveryMethod: {
            type: "string",
            enum: ["ship", "pickup"],
            default: "ship",
          },
          address: { type: "string", minLength: 3, maxLength: 200 },
          apartment: { type: "string", maxLength: 200 },
          city: { type: "string", minLength: 1, maxLength: 100 },
          postalCode: { type: "string", maxLength: 30 },
          country: { type: "string", enum: ["Lebanon"] },
          payment: { type: "string", enum: ["pay_on_delivery"] },
        },
      },
      OrderConfirmation: {
        type: "object",
        required: [
          "id",
          "orderNumber",
          "customerName",
          "email",
          "status",
          "deliveryMethod",
          "subtotal",
          "shipping",
          "total",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          orderNumber: { type: "string", example: "FRM-ABC123-1A2B" },
          customerName: { type: "string" },
          email: { type: "string", format: "email" },
          status: { type: "string", enum: ["confirmed"] },
          deliveryMethod: { type: "string", enum: ["ship", "pickup"] },
          subtotal: { type: "number", minimum: 0 },
          shipping: { type: "number", minimum: 0 },
          total: { type: "number", minimum: 0 },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Service health",
        responses: { "200": jsonResponse("Service is ready") },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Create an account and session",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/Registration",
        }),
        responses: {
          "201": jsonResponse("Account created", {
            type: "object",
            properties: { user: { $ref: "#/components/schemas/User" } },
          }),
          "400": errorResponse("Invalid input"),
          "409": errorResponse("Email already registered"),
          "429": errorResponse("Registration rate limit exceeded"),
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Create a session",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/Credentials",
        }),
        responses: {
          "200": jsonResponse("Authenticated", {
            type: "object",
            properties: { user: { $ref: "#/components/schemas/User" } },
          }),
          "400": errorResponse("Invalid input"),
          "401": errorResponse("Invalid credentials"),
          "429": errorResponse("Login rate limit exceeded"),
        },
      },
    },
    "/api/auth/session": {
      get: {
        tags: ["Authentication"],
        summary: "Read the current session",
        security: sessionSecurity,
        responses: {
          "200": jsonResponse("Current user", {
            type: "object",
            properties: { user: { $ref: "#/components/schemas/User" } },
          }),
          "401": errorResponse("Authentication required"),
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Revoke the current session and clear its cookie",
        responses: {
          "200": jsonResponse("Signed out", {
            type: "object",
            properties: { success: { type: "boolean", const: true } },
          }),
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Search, filter, and sort products",
        parameters: [
          {
            name: "q",
            in: "query",
            description:
              "Search product names, descriptions, categories, and tags",
            schema: { type: "string", maxLength: 100 },
          },
          {
            name: "category",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "all",
                "boards",
                "hardware",
                "ramps",
                "wearables",
                "accessories",
              ],
              default: "all",
            },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["featured", "price-low", "price-high", "name"],
              default: "featured",
            },
          },
        ],
        responses: {
          "200": jsonResponse("Catalog", productListSchema),
        },
      },
    },
    "/api/assets/{key}": {
      get: {
        tags: ["Products"],
        summary: "Read an image stored in the database",
        parameters: [
          {
            name: "key",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "images/products/diy-quarter-pipe-v3.jpg",
          },
        ],
        responses: {
          "200": {
            description: "Image bytes",
            content: {
              "image/jpeg": { schema: { type: "string", format: "binary" } },
              "image/png": { schema: { type: "string", format: "binary" } },
            },
          },
          "304": { description: "Not modified" },
          "404": errorResponse("Asset not found"),
        },
      },
    },
    "/api/products/{slug}": {
      get: {
        tags: ["Products"],
        summary: "Read one product",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": jsonResponse("Product detail", {
            type: "object",
            properties: { product: { $ref: "#/components/schemas/Product" } },
          }),
          "404": errorResponse("Product not found"),
        },
      },
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        security: sessionSecurity,
        summary: "Read the cart",
        responses: {
          "200": jsonResponse("Cart lines", cartSchema),
          "401": errorResponse("Authentication required"),
        },
      },
      post: {
        tags: ["Cart"],
        security: sessionSecurity,
        summary: "Add a cart item",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/AddCartItem",
        }),
        responses: {
          "201": jsonResponse("Updated cart", cartSchema),
          "400": errorResponse("Invalid product or input"),
          "401": errorResponse("Authentication required"),
          "409": errorResponse("Insufficient stock"),
        },
      },
      patch: {
        tags: ["Cart"],
        security: sessionSecurity,
        summary: "Update quantity or variant",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/UpdateCartItem",
        }),
        responses: {
          "200": jsonResponse("Updated cart", cartSchema),
          "400": errorResponse("Invalid product or input"),
          "401": errorResponse("Authentication required"),
          "404": errorResponse("Cart item not found"),
          "409": errorResponse("Insufficient stock"),
        },
      },
      delete: {
        tags: ["Cart"],
        security: sessionSecurity,
        summary: "Remove a cart item",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/CartItemIdentity",
        }),
        responses: {
          "200": jsonResponse("Updated cart", cartSchema),
          "400": errorResponse("Invalid input"),
          "401": errorResponse("Authentication required"),
        },
      },
    },
    "/api/wishlist": {
      get: {
        tags: ["Wishlist"],
        security: sessionSecurity,
        summary: "Read the wishlist",
        responses: {
          "200": jsonResponse("Products", productListSchema),
          "401": errorResponse("Authentication required"),
        },
      },
      post: {
        tags: ["Wishlist"],
        security: sessionSecurity,
        summary: "Add a product",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/WishlistItem",
        }),
        responses: {
          "201": jsonResponse("Updated wishlist", productListSchema),
          "400": errorResponse("Invalid input"),
          "401": errorResponse("Authentication required"),
          "404": errorResponse("Product not found"),
        },
      },
      delete: {
        tags: ["Wishlist"],
        security: sessionSecurity,
        summary: "Remove a product",
        requestBody: jsonRequest({
          $ref: "#/components/schemas/WishlistItem",
        }),
        responses: {
          "200": jsonResponse("Updated wishlist", productListSchema),
          "400": errorResponse("Invalid input"),
          "401": errorResponse("Authentication required"),
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Orders"],
        security: sessionSecurity,
        summary: "Place an order transactionally",
        requestBody: jsonRequest({ $ref: "#/components/schemas/Checkout" }),
        responses: {
          "201": jsonResponse("Order confirmation", {
            type: "object",
            properties: {
              order: { $ref: "#/components/schemas/OrderConfirmation" },
            },
          }),
          "400": errorResponse("Invalid checkout details"),
          "401": errorResponse("Authentication required"),
          "409": errorResponse("Empty cart or insufficient stock"),
        },
      },
    },
  },
} as const;
