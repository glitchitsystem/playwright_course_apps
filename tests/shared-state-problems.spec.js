import { test, expect } from "@playwright/test";

test.describe("Shared State Problems - Manual Test Cases", () => {
  test("Global Counter Problem - matches Manual Test Case 1", async ({
    page,
  }) => {
    let startValue;

    await test.step("Navigate to Shared State Demo page", async () => {
      await page.goto("shared-state.html");
      const initialValue = await page
        .getByTestId("global-counter")
        .textContent();
      startValue = parseInt(initialValue);
    });

    await test.step('Click "Global Counter +5" button twice (counter shows 10)', async () => {
      await page.getByTestId("increment-global-5").click();
      await page.getByTestId("increment-global-5").click();
      await expect(page.getByTestId("global-counter")).toHaveText(
        (startValue + 10).toString()
      );
    });

    await test.step("Open new browser tab/window to the same page", async () => {
      await page.reload(); // Simulates opening new tab with same localStorage
    });

    await test.step('Expected: Counter shows "10" in new tab (demonstrates shared state issue)', async () => {
      await expect(page.getByTestId("global-counter")).toHaveText(
        (startValue + 10).toString()
      );
    });
  });

  test("Authentication Persistence - matches Manual Test Case 2", async ({
    page,
  }) => {
    await test.step("Navigate to Shared State Demo page", async () => {
      await page.goto("shared-state.html");
    });

    await test.step('Click "Login" button (uses pre-filled credentials)', async () => {
      await page.getByTestId("login-btn").click();
    });

    await test.step("Refresh the page", async () => {
      await page.reload();
    });

    await test.step("Expected: Still shows logged-in state with welcome message", async () => {
      await expect(page.getByTestId("logged-in-section")).toBeVisible();
      await expect(page.getByTestId("auth-status")).toHaveText("Logged In");
      await expect(page.getByTestId("logged-in-user")).toHaveText("testuser");
    });

    await test.step('Click "Logout"', async () => {
      await page.getByTestId("logout-btn").click();
    });

    await test.step("Expected: Returns to login form", async () => {
      await expect(page.getByTestId("login-section")).toBeVisible();
      await expect(page.getByTestId("logged-in-section")).toBeHidden();
      await expect(page.getByTestId("auth-status")).toHaveText("Not Logged In");
    });
  });

  test("Good vs Bad Practice - matches Manual Test Case 3", async ({
    page,
  }) => {
    await test.step("Navigate to Shared State Demo page", async () => {
      await page.goto("shared-state.html");
    });

    await test.step("Increment Global Counter to 5", async () => {
      for (let i = 0; i < 5; i++) {
        await page.getByTestId("increment-global").click();
      }
    });

    await test.step("Increment Session Counter to 3", async () => {
      await page.getByTestId("increment-session").click();
      await page.getByTestId("increment-session").click();
      await page.getByTestId("increment-session").click();
      await expect(page.getByTestId("session-counter")).toHaveText("3");
    });

    await test.step("Refresh the page", async () => {
      await page.reload();
    });

    await test.step('Expected: Global Counter still shows "5" (problematic - persists)', async () => {
      await expect(page.getByTestId("global-counter")).toHaveText("5");
    });

    await test.step('Expected: Session Counter shows "0" (good practice - resets)', async () => {
      await expect(page.getByTestId("session-counter")).toHaveText("0");
    });
  });
});

test.describe("Proper State Management in Tests", () => {
  // Reset global state before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("shared-state.html");

    // Clear global counter
    await page.getByTestId("reset-global").click();

    // Clear persistent form
    await page.getByTestId("clear-persistent").click();

    // Ensure logged out
    const loggedInSection = page.getByTestId("logged-in-section");
    if (await loggedInSection.isVisible()) {
      await page.getByTestId("logout-btn").click();
    }
  });

  test("Global counter starts at 0 when properly reset", async ({ page }) => {
    // Thanks to beforeEach, we know global counter is reset
    await expect(page.getByTestId("global-counter")).toHaveText("0");

    // Test can safely assume clean state
    await page.getByTestId("increment-global").click();
    await expect(page.getByTestId("global-counter")).toHaveText("1");
  });
});
