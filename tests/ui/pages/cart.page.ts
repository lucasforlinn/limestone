import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
  }

  itemByName(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  quantityOf(productName: string): Locator {
    return this.itemByName(productName).getByTestId("item-quantity");
  }
}
