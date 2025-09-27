import { test, expect } from "@playwright/test";

test.describe("Test Isolation Scenarios - Manual Test Cases", () => {
  test("Form Independence - matches Manual Test Case 1", async ({ page }) => {
    await test.step("Navigate to Isolation Test page", async () => {
      await page.goto("isolation-test.html");
    });

    await test.step('Fill in name "John" and email "john@test.com"', async () => {
      await page.getByTestId("name-input").fill("John");
      await page.getByTestId("email-input").fill("john@test.com");
    });

    await test.step('Click "Submit" button', async () => {
      await page.getByTestId("submit-button").click();
      await expect(page.getByTestId("form-result")).toContainText(
        "Form submitted successfully!"
      );
      await expect(page.getByTestId("form-result")).toContainText("John");
      await expect(page.getByTestId("form-result")).toContainText(
        "john@test.com"
      );
    });

    await test.step('Click "Clear" button', async () => {
      await page.getByTestId("clear-button").click();
    });

    await test.step("Expected: Form is empty and no result message shown", async () => {
      await expect(page.getByTestId("name-input")).toHaveValue("");
      await expect(page.getByTestId("email-input")).toHaveValue("");
      await expect(page.getByTestId("form-result")).toBeEmpty();
    });
  });

  test("Todo List Reset - matches Manual Test Case 2", async ({ page }) => {
    await test.step("Navigate to Isolation Test page", async () => {
      await page.goto("isolation-test.html");
    });

    await test.step("Add 3 todo items", async () => {
      await page.getByTestId("todo-input").fill("Learn Playwright");
      await page.getByTestId("add-todo").click();

      await page.getByTestId("todo-input").fill("Write tests");
      await page.getByTestId("add-todo").click();

      await page.getByTestId("todo-input").fill("Deploy application");
      await page.getByTestId("add-todo").click();

      await expect(page.getByTestId("todo-count")).toHaveText("3");
    });

    await test.step('Click "Clear All" button', async () => {
      await page.getByTestId("clear-todos").click();
    });

    await test.step('Expected: Todo list is empty and count shows "0"', async () => {
      await expect(page.getByTestId("todo-list")).toBeEmpty();
      await expect(page.getByTestId("todo-count")).toHaveText("0");
    });
  });

  test("Toggle State Reset - matches Manual Test Case 3", async ({ page }) => {
    await test.step("Navigate to Isolation Test page", async () => {
      await page.goto("isolation-test.html");
    });

    await test.step('Enable both "Feature A" and "Feature B" checkboxes', async () => {
      await page.getByTestId("toggle-1").check();
      await page.getByTestId("toggle-2").check();

      await expect(page.getByTestId("toggle-1")).toBeChecked();
      await expect(page.getByTestId("toggle-2")).toBeChecked();
      await expect(page.getByTestId("feature-a")).toBeVisible();
      await expect(page.getByTestId("feature-b")).toBeVisible();
      await expect(page.getByTestId("active-features")).toHaveText("A, B");
    });

    await test.step('Click "Reset All Toggles" button', async () => {
      await page.getByTestId("reset-toggles").click();
    });

    await test.step('Expected: Both checkboxes are unchecked and "Active Features" shows "None"', async () => {
      await expect(page.getByTestId("toggle-1")).not.toBeChecked();
      await expect(page.getByTestId("toggle-2")).not.toBeChecked();
      await expect(page.getByTestId("feature-a")).toBeHidden();
      await expect(page.getByTestId("feature-b")).toBeHidden();
      await expect(page.getByTestId("active-features")).toHaveText("None");
    });
  });

  test("Test isolation verification between tests", async ({ page }) => {
    await test.step("Navigate to Isolation Test page", async () => {
      await page.goto("isolation-test.html");
    });

    await test.step("Verify completely clean state", async () => {
      await expect(page.getByTestId("name-input")).toHaveValue("");
      await expect(page.getByTestId("email-input")).toHaveValue("");
      await expect(page.getByTestId("form-result")).toBeEmpty();
      await expect(page.getByTestId("todo-count")).toHaveText("0");
      await expect(page.getByTestId("todo-list")).toBeEmpty();
      await expect(page.getByTestId("toggle-1")).not.toBeChecked();
      await expect(page.getByTestId("toggle-2")).not.toBeChecked();
      await expect(page.getByTestId("active-features")).toHaveText("None");
    });
  });
});

test("Feature toggles start clean in new test", async ({ page }) => {
  await page.goto("isolation-test.html");

  // Verify fresh state (no feature flags from previous test)
  await expect(page.getByTestId("toggle-1")).not.toBeChecked();
  await expect(page.getByTestId("toggle-2")).not.toBeChecked();
  await expect(page.getByTestId("active-features")).toHaveText("None");
});

test.describe("Data Table Operations", () => {
  test("Add, sort, and clear table data", async ({ page }) => {
    await page.goto("isolation-test.html");

    // Verify table starts empty
    await expect(page.getByTestId("row-count")).toHaveText("0");
    await expect(page.getByTestId("table-body")).toBeEmpty();

    // Add several rows
    await page.getByTestId("add-row").click();
    await page.getByTestId("add-row").click();
    await page.getByTestId("add-row").click();

    // Verify rows were added
    await expect(page.getByTestId("row-count")).toHaveText("3");

    // Test sorting by name
    await page.getByTestId("sort-name").click();
    // Verify table still has 3 rows after sorting
    await expect(page.getByTestId("row-count")).toHaveText("3");

    // Test sorting by age
    await page.getByTestId("sort-age").click();
    await expect(page.getByTestId("row-count")).toHaveText("3");

    // Clear all data
    await page.getByTestId("clear-table").click();

    // Verify table is empty
    await expect(page.getByTestId("row-count")).toHaveText("0");
    await expect(page.getByTestId("table-body")).toBeEmpty();
  });

  test("Table data isolation between tests", async ({ page }) => {
    await page.goto("isolation-test.html");

    // Verify fresh state (no table data from previous test)
    await expect(page.getByTestId("row-count")).toHaveText("0");
    await expect(page.getByTestId("table-body")).toBeEmpty();
  });
});

// Demonstrate advanced isolation patterns
test.describe("Advanced Isolation Patterns", () => {
  test("Multiple scenarios in parallel contexts", async ({ browser }) => {
    let context1, context2, page1, page2;

    await test.step("Create two separate browser contexts to test isolation", async () => {
      context1 = await browser.newContext();
      context2 = await browser.newContext();

      page1 = await context1.newPage();
      page2 = await context2.newPage();

      await page1.goto("isolation-test.html");
      await page2.goto("isolation-test.html");
    });

    await test.step("Modify state in both browser contexts simultaneously", async () => {
      await page1.getByTestId("todo-input").fill("Context 1 Todo");
      await page1.getByTestId("add-todo").click();

      await page2.getByTestId("todo-input").fill("Context 2 Todo");
      await page2.getByTestId("add-todo").click();
    });

    await test.step("Verify isolation - Browser Context 1 has only its own data", async () => {
      await expect(page1.getByTestId("todo-list")).toContainText(
        "Context 1 Todo"
      );
      await expect(page1.getByTestId("todo-list")).not.toContainText(
        "Context 2 Todo"
      );
    });

    await test.step("Verify isolation - Browser Context 2 has only its own data", async () => {
      await expect(page2.getByTestId("todo-list")).toContainText(
        "Context 2 Todo"
      );
      await expect(page2.getByTestId("todo-list")).not.toContainText(
        "Context 1 Todo"
      );
    });

    await test.step("Clean up browser contexts", async () => {
      await context1.close();
      await context2.close();
    });
  });

  test("State cleanup verification", async ({ page }) => {
    // This test demonstrates how to verify cleanup worked
    await page.goto("isolation-test.html");

    // Add some data
    await page.getByTestId("todo-input").fill("Test todo");
    await page.getByTestId("add-todo").click();
    await page.getByTestId("toggle-1").check();

    // Verify data exists
    await expect(page.getByTestId("todo-count")).toHaveText("1");
    await expect(page.getByTestId("toggle-1")).toBeChecked();

    // Refresh page (simulates navigating away and back)
    await page.reload();

    // Verify in-memory state was cleared (good design)
    await expect(page.getByTestId("todo-count")).toHaveText("0");
    await expect(page.getByTestId("toggle-1")).not.toBeChecked();
  });
});
