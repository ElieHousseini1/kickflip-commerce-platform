import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { closeDatabase } from "../src/config/database.js";
import { bootstrapDatabase } from "../src/database/bootstrap.js";
import { Order } from "../src/database/models/order.model.js";

const app = createApp();

beforeAll(async () => {
  await bootstrapDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Form commerce API", () => {
  it("reports database readiness", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body).toEqual({ status: "ok", database: "connected" });
  });

  it("returns all 15 products and a product detail", async () => {
    const catalog = await request(app).get("/api/products").expect(200);
    expect(catalog.body.products).toHaveLength(15);
    const catalogProducts = catalog.body.products as {
      id: string;
      price: number;
    }[];
    expect(catalogProducts.find((item) => item.id === "vase-002")?.price).toBe(
      45,
    );

    const product = catalog.body.products[0];
    const detail = await request(app)
      .get(`/api/products/${product.slug as string}`)
      .expect(200);
    expect(detail.body.product.id).toBe(product.id);
    expect(detail.body.product.variants.length).toBeGreaterThan(0);
  });

  it("searches, filters, and sorts products on the server", async () => {
    const searched = await request(app)
      .get("/api/products?q=helmet")
      .expect(200);
    expect(searched.body.products).toHaveLength(1);
    expect(searched.body.products[0].id).toBe("headphones-001");
    expect(searched.body.total).toBe(15);

    const boards = await request(app)
      .get("/api/products?category=boards&sort=price-low")
      .expect(200);
    expect(boards.body.products).toHaveLength(3);
    expect(
      (boards.body.products as { price: number }[]).map(
        (product) => product.price,
      ),
    ).toEqual([240, 290, 420]);

    await request(app).get("/api/products?sort=unknown").expect(400);
  });

  it("publishes request schemas for every mutation family", async () => {
    const response = await request(app).get("/openapi.json").expect(200);
    expect(response.body.paths["/api/cart"].post.requestBody).toBeDefined();
    expect(response.body.paths["/api/wishlist"].post.requestBody).toBeDefined();
    expect(response.body.paths["/api/orders"].post.requestBody).toBeDefined();
    expect(response.body.components.securitySchemes.sessionCookie.name).toBe(
      "form_session",
    );
  });

  it("rejects protected requests without a session", async () => {
    const response = await request(app).get("/api/cart").expect(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");

    const session = await request(app).get("/api/auth/session").expect(401);
    expect(session.body.error.code).toBe("UNAUTHORIZED");
  });

  it("validates account input", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Origin", "http://localhost:3000")
      .send({ name: "A", email: "not-an-email", password: "short" })
      .expect(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("requires at least 12 characters for new passwords", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Password Test",
        email: "password-test@example.com",
        password: "ElevenChars",
      })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Password must be at least 12 characters.",
    });
  });

  it("rejects passwords made from one repeated character", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Password Test",
        email: "repeated-password@example.com",
        password: "111111111111",
      })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Password cannot consist of one repeated character.",
    });
  });

  it("does not accept legacy password rules during login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Origin", "http://localhost:3000")
      .send({ email: "legacy@example.com", password: "old-pass" })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Password must be at least 12 characters.",
    });
  });

  it("rejects unknown request fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Strict Input",
        email: "strict@example.com",
        password: "correct-horse-battery-staple",
        role: "admin",
      })
      .expect(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("supports registration, wishlist, cart, variant updates, and checkout", async () => {
    const agent = request.agent(app);
    const registration = await agent
      .post("/api/auth/register")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Integration Customer",
        email: "integration@example.com",
        password: "correct-horse-battery-staple",
      })
      .expect(201);
    expect(registration.body.user.email).toBe("integration@example.com");

    await agent.get("/api/auth/session").expect(200);
    const catalog = await agent.get("/api/products").expect(200);
    const product = catalog.body.products[0];
    const firstVariant = product.variants[0];
    const secondVariant = product.variants[1];

    const wishlist = await agent
      .post("/api/wishlist")
      .set("Origin", "http://localhost:3000")
      .send({ productId: product.id })
      .expect(201);
    expect(wishlist.body.products).toHaveLength(1);
    const removedWishlist = await agent
      .delete("/api/wishlist")
      .set("Origin", "http://localhost:3000")
      .send({ productId: product.id })
      .expect(200);
    expect(removedWishlist.body.products).toHaveLength(0);

    await agent
      .post("/api/cart")
      .set("Origin", "http://localhost:3000")
      .send({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
      .expect(201);

    const updated = await agent
      .patch("/api/cart")
      .set("Origin", "http://localhost:3000")
      .send({
        productId: product.id,
        variantId: firstVariant.id,
        nextVariantId: secondVariant.id,
      })
      .expect(200);
    expect(updated.body.lines[0].variantId).toBe(secondVariant.id);

    const order = await agent
      .post("/api/orders")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "<script>alert(1)</script> Customer",
        email: "integration@example.com",
        phone: "+96171441351",
        address: "1 Test Street'); DROP TABLE orders; --",
        apartment: "Suite 2",
        city: "Beirut",
        country: "Lebanon",
        payment: "pay_on_delivery",
      })
      .expect(201);
    expect(order.body.order.orderNumber).toMatch(/^FRM-/);
    expect(order.headers["content-type"]).toMatch(/application\/json/);
    expect(order.body.order.total).toBeGreaterThan(0);
    expect(order.body.order.deliveryMethod).toBe("ship");
    const storedOrder = await Order.findByPk(order.body.order.id as string);
    expect(storedOrder).toMatchObject({
      customerName: "<script>alert(1)</script> Customer",
      address: "1 Test Street'); DROP TABLE orders; --",
      phone: "+96171441351",
      apartment: "Suite 2",
      postalCode: "",
    });

    const emptyCart = await agent.get("/api/cart").expect(200);
    expect(emptyCart.body.lines).toEqual([]);
    const emptyOrder = await agent
      .post("/api/orders")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Integration Customer",
        email: "integration@example.com",
        deliveryMethod: "pickup",
      })
      .expect(409);
    expect(emptyOrder.body.error.code).toBe("EMPTY_CART");

    const pickupProduct = (
      catalog.body.products as { id: string; variants: { id: string }[] }[]
    ).find((item) => item.id === "vase-002");
    expect(pickupProduct).toBeDefined();
    if (!pickupProduct) throw new Error("Pickup test product was not found.");
    const pickupVariant = pickupProduct.variants[0];
    if (!pickupVariant) throw new Error("Pickup test variant was not found.");
    await agent
      .post("/api/cart")
      .set("Origin", "http://localhost:3000")
      .send({
        productId: pickupProduct.id,
        variantId: pickupVariant.id,
        quantity: 1,
      })
      .expect(201);
    const pickupOrder = await agent
      .post("/api/orders")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Integration Customer",
        email: "integration@example.com",
        deliveryMethod: "pickup",
        payment: "pay_on_delivery",
      })
      .expect(201);
    expect(pickupOrder.body.order).toMatchObject({
      deliveryMethod: "pickup",
      subtotal: 45,
      shipping: 0,
      total: 45,
    });

    await agent
      .post("/api/cart")
      .set("Origin", "http://localhost:3000")
      .send({
        productId: pickupProduct.id,
        variantId: pickupVariant.id,
        quantity: 1,
      })
      .expect(201);
    const shippedOrder = await agent
      .post("/api/orders")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Integration Customer",
        email: "integration@example.com",
        deliveryMethod: "ship",
        address: "1 Test Street",
        city: "Beirut",
        country: "Lebanon",
      })
      .expect(201);
    expect(shippedOrder.body.order).toMatchObject({
      deliveryMethod: "ship",
      subtotal: 45,
      shipping: 6,
      total: 51,
    });

    await agent
      .post("/api/auth/logout")
      .set("Origin", "http://localhost:3000")
      .expect(200);
    await agent.get("/api/auth/session").expect(401);
  });

  it("rejects mutation requests from untrusted origins", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Origin", "https://attacker.example")
      .send({ email: "integration@example.com", password: "password" })
      .expect(403);
    expect(response.body.error.code).toBe("INVALID_ORIGIN");
  });
});
