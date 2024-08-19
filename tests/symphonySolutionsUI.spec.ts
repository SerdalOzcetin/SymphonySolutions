import { test, expect, Locator } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // Expect a title "to contain" a substring.
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption("Name (A to Z)");

  let titles: Locator[] = await page.locator(".inventory_item_name").all();

  const sortedTitle: Locator[] = titles.sort();

  function areArraysEqual(arr1: Locator[], arr2: Locator[]) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  expect(areArraysEqual(titles, sortedTitle)).toBeTruthy();
});
