import type { Locator, Page } from "@playwright/test";
import { ROUTES } from "../../constants";
import { CartPage } from "./cart.page";

export class InventoryPage {
  private readonly page: Page;
  private readonly items: Locator;
  private readonly cartLink: Locator;
  readonly title: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
  }

  async addItemToCart(productName: string): Promise<void> {
    const card = this.items.filter({ hasText: productName });
    await card.getByRole("button", { name: "Add to cart" }).click();
  }

  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    await this.page.waitForURL(ROUTES.CART);
    return new CartPage(this.page);
  }
}
