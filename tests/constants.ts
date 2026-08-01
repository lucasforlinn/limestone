export const ROUTES = {
  LOGIN: "/",
  CART: "/cart.html",
} as const;

export const API_ENDPOINTS = {
  POSTS: "/posts",
} as const;

export const TEST_USER = {
  username: process.env.UI_USERNAME ?? "standard_user",
  password: process.env.UI_PASSWORD ?? "secret_sauce",
} as const;

export const PRODUCT = {
  BACKPACK: "Sauce Labs Backpack",
} as const;
