import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3200";
const outputDirectory = path.join(process.cwd(), "docs", "screenshots");
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await desktop.newPage();

await page.goto(`${baseURL}/signup`);
await page.getByLabel("Full name").fill("Portfolio Reviewer");
await page
  .getByLabel("Email address")
  .fill(`screenshots-${Date.now()}@example.com`);
await page
  .getByLabel("Password", { exact: true })
  .fill("portfolio-review-password");
await page.getByRole("button", { name: "Create account" }).click();
await page.waitForURL(/\/products$/);

await page.screenshot({
  path: path.join(outputDirectory, "catalog-desktop.png"),
  fullPage: true,
});

await page.locator("article").first().getByRole("link").first().click();
await page.screenshot({
  path: path.join(outputDirectory, "product-detail.png"),
  fullPage: true,
});

await page.getByRole("button", { name: "Add to cart" }).click();
await page.goto(`${baseURL}/cart`);
await page.screenshot({
  path: path.join(outputDirectory, "cart.png"),
  fullPage: true,
});

await page.getByRole("link", { name: /Proceed to checkout/ }).click();
await page.screenshot({
  path: path.join(outputDirectory, "checkout.png"),
  fullPage: true,
});

await page.getByLabel("Email address").fill("reviewer@example.com");
await page.getByLabel("Full name").fill("Portfolio Reviewer");
await page.getByLabel("Address", { exact: true }).fill("1 Design Street");
await page.getByLabel("City").fill("Beirut");
await page.getByLabel("Postal code").fill("1100");
await page.getByRole("button", { name: /Place order/ }).click();
await page.getByRole("heading", { name: "Thank you, Portfolio." }).waitFor();
await page.screenshot({
  path: path.join(outputDirectory, "order-confirmation.png"),
  fullPage: true,
});

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  storageState: await desktop.storageState(),
  deviceScaleFactor: 1,
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${baseURL}/products`);
await mobilePage.screenshot({
  path: path.join(outputDirectory, "catalog-mobile.png"),
  fullPage: true,
});

await mobile.close();
await desktop.close();
await browser.close();
