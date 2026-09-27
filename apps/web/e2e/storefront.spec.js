import { expect, test } from "@playwright/test";

const password = "correct-horse-battery-staple";

async function registerCustomer(page, name) {
  const email = `customer-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  await page.goto("/signup");
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/products$/);
  const promotion = page.getByRole("dialog", {
    name: "Save 20% on selected gear.",
  });
  await expect(promotion).toBeVisible();
  await promotion.getByRole("button", { name: "Close promotion" }).click();
  return email;
}

test("a customer can register, add a product, and place an order", async ({
  page,
}) => {
  await registerCustomer(page, "E2E Customer");
  await expect(page.locator("article")).toHaveCount(12);
  await page.getByRole("button", { name: "Page 2" }).click();
  await expect(page).toHaveURL(/\/products\?page=2$/);
  await expect(page.locator("article")).toHaveCount(3);
  await page.reload();
  await expect(page.locator("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Previous page" }).click();
  await expect(page.locator("article")).toHaveCount(12);
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill("street complete");
  await expect(
    page.getByRole("option", { name: /Street Complete/ }),
  ).toBeVisible();
  await page.getByRole("searchbox", { name: "Search products" }).press("Enter");
  await expect(page).toHaveURL(/\/products\?q=street(?:%20|\+)complete$/);
  await expect(page.locator("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Cancel search" }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.locator("article")).toHaveCount(12);
  await expect(
    page.getByRole("searchbox", { name: "Search products" }),
  ).toHaveValue("");
  const firstCard = page.locator("article").first();
  await firstCard.getByRole("button", { name: "Add to cart" }).click();
  await expect(
    firstCard.getByRole("button", { name: "Remove from bag" }),
  ).toBeVisible();
  await firstCard.getByRole("button", { name: "Remove from bag" }).click();
  await expect(
    firstCard.getByRole("button", { name: "Add to cart" }),
  ).toBeVisible();
  await page
    .locator("article")
    .first()
    .getByRole("button", { name: /Quick view/ })
    .click();
  await page.getByRole("link", { name: "View full product details" }).click();
  await expect(page).toHaveURL(/\/products\/.+/);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /Cart/ })).toBeVisible();
  await page.getByRole("link", { name: /Proceed to checkout/ }).click();

  const summaryBackgroundReachesEdge = await page
    .getByRole("complementary", { name: "Checkout summary" })
    .evaluate((summary) => {
      const fill = window.getComputedStyle(summary, "::after");
      return (
        fill.backgroundColor ===
          window.getComputedStyle(summary).backgroundColor &&
        summary.getBoundingClientRect().right + Number.parseFloat(fill.width) >=
          window.innerWidth - 1
      );
    });
  expect(summaryBackgroundReachesEdge).toBe(true);
  await expect(page.getByRole("group", { name: "Delivery" })).not.toContainText(
    "First name",
  );
  await expect(
    page.getByRole("group", { name: "Billing address" }),
  ).toContainText("First name (optional)");

  await page
    .locator("main")
    .getByLabel("Email address")
    .fill("customer@example.com");
  await page.getByLabel("First name (optional)").fill("E2E");
  await page.getByLabel("Last name").fill("   ");
  await page.getByLabel("Address", { exact: true }).fill("1 Test Street");
  await page.getByLabel("Apartment, suite, etc. (optional)").fill("Suite 2");
  await page.getByLabel("City").fill("Beirut");
  await page.getByLabel("Phone number (optional)").fill("71441351");
  await expect(page.getByLabel("Country / region")).toHaveValue("Lebanon");
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(
    page.getByText("Enter a last name of at least 2 characters."),
  ).toBeVisible();
  await page.getByLabel("Last name").fill("Customer");
  await expect(
    page.getByRole("heading", { name: "You might also like" }),
  ).toBeVisible();
  const placeOrder = page.getByRole("button", { name: /Place order/ });
  const initialTotal = await placeOrder.textContent();
  await page
    .getByRole("region", { name: "You might also like" })
    .getByRole("button", { name: "Add", exact: true })
    .first()
    .click();
  await expect(placeOrder).not.toHaveText(initialTotal);
  await placeOrder.click();

  await expect(
    page.getByRole("heading", { name: "Thank you, E2E." }),
  ).toBeVisible();
});

test("the authenticated catalog does not overflow on mobile", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__injectedScriptRan = false;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const injectedName = '<img src=x onerror="window.__injectedScriptRan=true">';
  await registerCustomer(page, injectedName);
  await expect(page.getByTitle(injectedName)).toContainText(injectedName);
  expect(await page.evaluate(() => window.__injectedScriptRan)).toBe(false);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);

  await expect(page.getByRole("button", { name: /Quick view/ })).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("favorites survive sign-out and sign-in and can be removed", async ({
  page,
}) => {
  const email = await registerCustomer(page, "Favorite Customer");
  await page
    .locator("article")
    .first()
    .getByRole("button", { name: "Add to wishlist" })
    .click();
  await expect(
    page.getByRole("link", { name: "Wishlist with 1 items" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/signup");
  await page.getByLabel("Full name").fill("Favorite Customer");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByText("An account with this email already exists."),
  ).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("incorrect-password-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByText("The email or password you entered is incorrect."),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/products$/);

  await page.goto("/wishlist");
  await expect(page.locator("article")).toHaveCount(1);
  await page
    .locator("article")
    .getByRole("button", { name: "Remove from wishlist" })
    .click();
  await expect(page.getByText("Your stash is empty.")).toBeVisible();
});

test("pickup purchase has no delivery charge", async ({ page }) => {
  await registerCustomer(page, "Pickup Customer");
  await page.goto("/products/pocket-skate-tool");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/checkout");
  await expect(page.getByLabel("Pickup details")).toHaveCount(0);
  await page.getByRole("radio", { name: /Pickup/ }).check();
  await expect(page.getByLabel("Pickup details")).toContainText(
    "Pickup area: Beirut, Lebanon",
  );
  await expect(page.getByLabel("Pickup details")).toContainText(
    "Allow 5 hours for your order to be ready for pickup.",
  );
  await expect(
    page.getByRole("link", { name: "View Beirut on Google Maps" }),
  ).toHaveAttribute(
    "href",
    "https://www.google.com/maps/search/?api=1&query=Beirut%2C%20Lebanon",
  );
  await expect(page.getByLabel("Address", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("group", { name: "Billing address" }),
  ).toContainText("No street address is needed for pickup.");
  await expect(
    page.getByRole("complementary", { name: "Checkout summary" }),
  ).toContainText("Free");
  await page
    .locator("main")
    .getByLabel("Email address")
    .fill("pickup@example.com");
  await page.getByLabel("Last name").fill("Customer");
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you, Customer." }),
  ).toBeVisible();
});
