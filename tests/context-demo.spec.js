import { test, expect } from "@playwright/test";

test.describe("Context Demo - Browser Context Isolation", () => {
  test("Theme Persistence - matches Manual Test Case 1", async ({ page }) => {
    await test.step("Navigate to Context Demo page", async () => {
      await page.goto("context.html");
    });

    await test.step('Change theme to "Dark"', async () => {
      await page.getByTestId("theme-select").selectOption("dark");
    });

    await test.step('Click "Save Context A Settings"', async () => {
      await page.getByTestId("save-button").click();
    });

    await test.step("Refresh the page", async () => {
      await page.reload();
    });

    await test.step('Expected: Dark theme is still applied and theme dropdown shows "Dark"', async () => {
      await expect(page.getByTestId("theme-select")).toHaveValue("dark");
      await expect(page.locator("body")).toHaveClass(/theme-dark/);
    });
  });

  test("Counter State - matches Manual Test Case 2", async ({ page }) => {
    await test.step("Navigate to Context Demo page", async () => {
      await page.goto("context.html");
    });

    await test.step('Click "Increment" button 3 times', async () => {
      await page.getByTestId("increment-button").click();
      await page.getByTestId("increment-button").click();
      await page.getByTestId("increment-button").click();
    });

    await test.step("Navigate to Shared State page", async () => {
      await page.getByTestId("navigate-shared-state").click();
      await expect(page).toHaveURL(/shared-state\.html/);
    });

    await test.step("Navigate back to Context Demo page", async () => {
      await page.goto("context.html");
    });

    await test.step('Expected: Counter shows "3" (localStorage persists within same context)', async () => {
      await expect(page.getByTestId("counter-value")).toHaveText("3");
    });
  });

  test("Fresh context isolation verification", async ({ page }) => {
    await test.step("Navigate to context page", async () => {
      await page.goto("context.html");
    });

    await test.step("Verify clean state despite previous tests modifying localStorage", async () => {
      await expect(page.getByTestId("counter-value")).toHaveText("0");
      await expect(page.getByTestId("username-input")).toHaveValue("");
      await expect(page.getByTestId("theme-select")).toHaveValue("light");
      await expect(page.getByTestId("remember-checkbox")).not.toBeChecked();
    });
  });
});
