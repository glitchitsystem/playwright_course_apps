import { test, expect } from "@playwright/test";

test.describe("Cross-Context Behavior Comparison - Manual Test Cases", () => {
  test("Same Context Navigation - matches Manual Test Case 3", async ({
    page,
  }) => {
    await test.step("Navigate to context.html", async () => {
      await page.goto("context.html");
    });

    await test.step('Set username to "User1", increment counter to 5', async () => {
      await page.getByTestId("username-input").fill("User1");

      for (let i = 0; i < 5; i++) {
        await page.getByTestId("increment-button").click();
      }

      await page.getByTestId("save-button").click();
    });

    await test.step("Navigate to shared-state.html (same tab/context)", async () => {
      await page.getByTestId("navigate-shared-state").click();
      await expect(page).toHaveURL(/shared-state\.html/);
    });

    await test.step("Navigate back to context.html", async () => {
      await page.goto("context.html");
    });

    await test.step("Expected: Username and counter preserved", async () => {
      await expect(page.getByTestId("username-input")).toHaveValue("User1");
      await expect(page.getByTestId("counter-value")).toHaveText("5");
    });
  });

  test("Fresh Context Has Clean State - matches Playwright Test Case", async ({
    page,
  }) => {
    await test.step("Navigate to context.html (fresh browser context)", async () => {
      await page.goto("context.html");
    });

    await test.step("Verify completely clean state (fresh context)", async () => {
      await expect(page.getByTestId("username-input")).toHaveValue("");
      await expect(page.getByTestId("counter-value")).toHaveText("0");
      await expect(page.getByTestId("theme-select")).toHaveValue("light");
      await expect(page.getByTestId("remember-checkbox")).not.toBeChecked();
    });
  });

  test("Shared State Problem Simulation", async ({ page }) => {
    await test.step("Open browser, navigate to shared-state.html", async () => {
      await page.goto("shared-state.html");
    });

    await test.step('Set Global Counter to 10, save persistent form with name "Test User"', async () => {
      for (let i = 0; i < 10; i++) {
        await page.getByTestId("increment-global").click();
      }

      await page.getByTestId("persistent-name").fill("Test User");
      await page.getByTestId("persistent-role").selectOption("admin");
      await page.getByTestId("save-persistent").click();
    });

    await test.step("Close browser completely", async () => {
      await page.reload(); // Simulates closing and reopening browser
    });

    await test.step("Open new browser, navigate to shared-state.html again", async () => {
      // Page already reloaded to same URL
    });

    await test.step('Expected: Global Counter shows "10", form shows "Test User"', async () => {
      await expect(page.getByTestId("global-counter")).toHaveText("10");
      await expect(page.getByTestId("persistent-name")).toHaveValue(
        "Test User"
      );
      await expect(page.getByTestId("persistent-role")).toHaveValue("admin");
    });
  });
});

test.describe("Shared State Problem Demonstration", () => {
  test("Shared State Problem - matches Manual Test Case 4 - SHOULD FAIL", async ({
    page,
  }) => {
    await test.step("Navigate to shared-state page", async () => {
      await page.goto("shared-state.html");
    });

    await test.step("User A sets global counter to 5", async () => {
      await page.getByTestId("increment-global-5").click();
      await expect(page.getByTestId("global-counter")).toHaveText("5");
    });

    await test.step("User A logs in", async () => {
      await page.getByTestId("login-btn").click();
      await expect(page.getByTestId("auth-status")).toHaveText("Logged In");
    });

    await test.step("Simulate new browser session (page reload)", async () => {
      await page.reload();
    });

    await test.step("Test EXPECTS clean state but FAILS due to shared localStorage", async () => {
      // This assertion will FAIL because localStorage persists
      // This demonstrates why shared state is problematic for tests
      await expect(page.getByTestId("global-counter")).toHaveText("0"); // FAILS: actually shows "5"

      // This assertion will also FAIL because auth state persists
      await expect(page.getByTestId("auth-status")).toHaveText("Not Logged In"); // FAILS: actually shows "Logged In"
    });

    await test.step('Expected: Global counter shows "5" (not "0"), auth status shows "Logged In" (not "Not Logged In")', async () => {
      // These are the actual results that demonstrate the shared state problem
      await expect(page.getByTestId("global-counter")).toHaveText("5");
      await expect(page.getByTestId("auth-status")).toHaveText("Logged In");
    });
  });
});

test.describe("Multiple Browser Contexts Simulation", () => {
  test("Demonstrate proper context isolation - this test PASSES", async ({
    browser,
  }) => {
    let userAContext, userBContext, userAPage, userBPage;

    await test.step("Create separate browser contexts for different users", async () => {
      userAContext = await browser.newContext();
      userBContext = await browser.newContext();

      userAPage = await userAContext.newPage();
      userBPage = await userBContext.newPage();

      await userAPage.goto("shared-state.html");
      await userBPage.goto("shared-state.html");
    });

    await test.step("User A modifies state (Browser Context A)", async () => {
      await userAPage.getByTestId("increment-global-5").click();
      await userAPage.getByTestId("login-btn").click();

      await expect(userAPage.getByTestId("global-counter")).toHaveText("5");
      await expect(userAPage.getByTestId("auth-status")).toHaveText(
        "Logged In"
      );
    });

    await test.step("User B has clean state (Browser Context B - isolated)", async () => {
      // These assertions PASS because contexts are isolated
      await expect(userBPage.getByTestId("global-counter")).toHaveText("0");
      await expect(userBPage.getByTestId("auth-status")).toHaveText(
        "Not Logged In"
      );
    });

    await test.step("Clean up browser contexts", async () => {
      await userAContext.close();
      await userBContext.close();
    });
  });

  test("Context isolation prevents test interference", async ({ browser }) => {
    let context1, context2, page1, page2;

    await test.step("Create two separate browser contexts", async () => {
      context1 = await browser.newContext();
      context2 = await browser.newContext();

      page1 = await context1.newPage();
      page2 = await context2.newPage();

      await page1.goto("context.html");
      await page2.goto("context.html");
    });

    await test.step("Modify state in Browser Context 1", async () => {
      await page1.getByTestId("username-input").fill("Context1User");
      await page1.getByTestId("theme-select").selectOption("dark");
      await page1.getByTestId("increment-button").click();
      await page1.getByTestId("save-button").click();
    });

    await test.step("Verify Browser Context 1 has the data", async () => {
      await expect(page1.getByTestId("username-input")).toHaveValue(
        "Context1User"
      );
      await expect(page1.getByTestId("counter-value")).toHaveText("1");
      await expect(page1.getByTestId("theme-select")).toHaveValue("dark");
    });

    await test.step("Verify Browser Context 2 is completely isolated (clean)", async () => {
      await expect(page2.getByTestId("username-input")).toHaveValue("");
      await expect(page2.getByTestId("counter-value")).toHaveText("0");
      await expect(page2.getByTestId("theme-select")).toHaveValue("light");
    });

    await test.step("Clean up browser contexts", async () => {
      await context1.close();
      await context2.close();
    });
  });
});
