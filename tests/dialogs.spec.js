import { test, expect } from "@playwright/test";

test.afterAll(async () => {
  // Code
});

test.afterEach(async ({ page }) => {
  // Code
});

test.beforeAll(async () => {
  // Code
});

test.beforeEach(async ({ page }) => {
  page.goto("http://localhost:3000/windows-dialogs.html");
});

test.describe("sample suite", () => {
  test("Test windows ", async ({ page }) => {
    const [testTab] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-tab").click(),
    ]);

    await testTab.waitForLoadState();
    await expect(testTab.getByRole("heading", { level: 1 })).toHaveText(
      "New Tab Opened"
    );

    await testTab.close();
  });

  test("Test multi windows", async ({ page, context }) => {
    const [testTab] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-tab").click(),
    ]);

    const [testWindow] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-window").click(),
    ]);

    await testTab.waitForLoadState();
    await testWindow.waitForLoadState();

    expect(context.pages().length).toBe(3);
  });

  test(
    "Test iframes ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      const internal = page.frameLocator("#internal-frame");

      await expect(internal.getByRole("heading", { level: 3 })).toHaveText(
        "Inside Frame Content"
      );
      await expect(
        internal.getByText("This content is loaded inside an iframe.")
      ).toBeVisible();

      await internal.getByTestId("frame-text-input").fill("Something");
      await internal.getByTestId("frame-button").click();
    }
  );

  test("Test alerts", async ({ page }) => {
    const [dialog] = await Promise.all([
      page.waitForEvent("dialog"),
      page.getByTestId("alert-dialog").click(),
    ]);

    expect(dialog.type()).toBe("alert");
  });
});
