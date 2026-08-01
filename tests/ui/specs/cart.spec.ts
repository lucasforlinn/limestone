import { expect, test } from "../fixtures";
import { PRODUCT, TEST_USER } from "../../constants";

test.describe("UI: Cart", () => {
  test("adds a product to the cart after signing in @smoke", async ({ loginPage, inventoryPage }) => {
    await test.step("sign in", async () => {
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);

      await expect(inventoryPage.title).toHaveText("Products");
    });

    await test.step("add the product to the cart", async () => {
      await inventoryPage.addItemToCart(PRODUCT.BACKPACK);

      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("the cart holds exactly that product", async () => {
      const cartPage = await inventoryPage.openCart();

      await expect(cartPage.title).toHaveText("Your Cart");
      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.itemByName(PRODUCT.BACKPACK)).toBeVisible();
      await expect(cartPage.quantityOf(PRODUCT.BACKPACK)).toHaveText("1");
    });
  });
});
