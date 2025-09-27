# Manual Test Cases - Playwright Core Concepts

## Context Demo Page (context.html)

### Test Case 1: Theme Persistence

**Concept: LocalStorage Persistence Within Browser Context**

1. Navigate to Context Demo page
2. Change theme to "Dark"
3. Click "Save Context A Settings"
4. Refresh the page
5. **Expected**: Dark theme is still applied and theme dropdown shows "Dark"

**Learning Points:**

- LocalStorage persists data across page refreshes within the same browser context
- This demonstrates why tests might fail if they expect a "clean" initial state
- In Playwright, each test gets a fresh context, so this persistence won't affect other tests
- Manual testing in the same browser session will show this persistence behavior

### Test Case 2: Counter State

**Concept: State Persistence Across Page Navigation**

1. Navigate to Context Demo page
2. Click "Increment" button 3 times
3. Navigate to Shared State page (using browser navigation, not new tab)
4. Navigate back to Context Demo page
5. **Expected**: Counter shows "3" (localStorage persists within same context)

**Learning Points:**

- LocalStorage data survives page navigation within the same browser session
- This is why test isolation is crucial - data from one page can affect another
- Playwright's fresh context per test prevents this cross-contamination
- Real applications often rely on this behavior, but tests should not

## Shared State Demo Page (shared-state.html)

### Test Case 1: Global Counter Problem

**Concept: Shared State Affecting Multiple Browser Instances**

1. Navigate to Shared State Demo page
2. Click "Global Counter +5" button twice (counter shows 10)
3. Open new browser tab/window to the same page
4. **Expected**: Counter shows "10" in new tab (demonstrates shared state issue)

**Learning Points:**

- LocalStorage is shared across all tabs/windows of the same browser for a domain
- This simulates how one test could affect another if they share the same browser context
- In test suites, this would cause "flaky" tests that pass/fail based on execution order
- Playwright prevents this by giving each test a fresh, isolated browser context

### Test Case 2: Authentication Persistence

**Concept: Session State Affecting Test Assumptions**

1. Navigate to Shared State Demo page
2. Click "Login" button (uses pre-filled credentials)
3. Refresh the page
4. **Expected**: Still shows logged-in state with welcome message
5. Click "Logout"
6. **Expected**: Returns to login form

**Learning Points:**

- Authentication state often persists in localStorage/cookies
- Tests that assume "logged out" state will fail if previous tests logged in
- This is a common source of test flakiness in real applications
- Good test practices include explicit login/logout steps rather than assuming initial state

### Test Case 3: Good vs Bad Practice

**Concept: Comparing Persistent vs Non-Persistent State**

1. Navigate to Shared State Demo page
2. Increment Global Counter to 5
3. Increment Session Counter to 3
4. Refresh the page
5. **Expected**:
   - Global Counter still shows "5" (problematic - persists via localStorage)
   - Session Counter shows "0" (good practice - resets as it's just a JavaScript variable)

**Learning Points:**

- Global Counter uses localStorage - BAD for test isolation
- Session Counter uses only JavaScript variables - GOOD for test isolation
- The difference shows why application design affects test reliability
- Tests should either reset persistent state or use fresh contexts to avoid interference

### Test Case 4: Shared State Problem Demonstration (Test Failure Scenario)

**Concept: Why Tests Fail Due to Shared State**

1. Navigate to shared-state page
2. User A sets global counter to 5
3. User A logs in
4. Simulate new browser session (page reload)
5. Test EXPECTS clean state but FAILS due to shared localStorage
6. **Expected**: Global counter shows "5" (not "0"), auth status shows "Logged In" (not "Not Logged In")

**Learning Points:**

- This test is designed to FAIL to demonstrate the shared state problem
- Tests that expect clean state will fail when localStorage persists
- This shows why test isolation is critical for reliable test suites
- The failure teaches the concept - shared state breaks test independence

## Isolation Test Page (isolation-test.html)

### Test Case 1: Form Independence

**Concept: Clean State Reset for Independent Tests**

1. Navigate to Isolation Test page
2. Fill in name "John" and email "john@test.com"
3. Click "Submit" button
4. Click "Clear" button
5. **Expected**: Form is empty and no result message shown

**Learning Points:**

- Each test scenario should be able to reset to a clean state
- The "Clear" button simulates what test.beforeEach() or similar setup should do
- Independent tests don't rely on data from previous test actions
- This form doesn't use localStorage, so it naturally resets on page refresh

### Test Case 2: Todo List Reset

**Concept: In-Memory State Management for Test Isolation**

1. Navigate to Isolation Test page
2. Add 3 todo items
3. Click "Clear All" button
4. **Expected**: Todo list is empty and count shows "0"

**Learning Points:**

- Todo list uses only JavaScript arrays (in-memory storage)
- No localStorage means state naturally resets on page refresh
- "Clear All" button demonstrates how tests should clean up after themselves
- This is an example of application design that's "test-friendly"

### Test Case 3: Toggle State Reset

**Concept: Feature Flag Management in Tests**

1. Navigate to Isolation Test page
2. Enable both "Feature A" and "Feature B" checkboxes
3. Click "Reset All Toggles" button
4. **Expected**: Both checkboxes are unchecked and "Active Features" shows "None"

**Learning Points:**

- Feature toggles are common in applications and tests
- Tests often need to set specific feature combinations
- Reset functionality ensures tests can start with known feature states
- This demonstrates how application state can be complex (multiple interdependent features)

## Cross-Page Playwright Test Scenarios

### Test Case 1: Fresh Context Isolation (Playwright)

**Concept: Playwright's Automatic Test Isolation**

```javascript
// This demonstrates how Playwright provides fresh contexts
test("Counter starts at 0 in fresh context", async ({ page }) => {
  await page.goto("context.html");
  await expect(page.getByTestId("counter-value")).toHaveText("0");
});

test("Counter still starts at 0 in another fresh context", async ({ page }) => {
  await page.goto("context.html");
  await page.getByTestId("increment-button").click();
  // Even though we incremented here, the next test will start fresh
  await expect(page.getByTestId("counter-value")).toHaveText("1");
});
```

**Learning Points:**

- Each Playwright test gets a completely fresh browser context
- LocalStorage, cookies, and session data are isolated between tests
- Tests can't accidentally affect each other through shared browser state
- This is why Playwright tests are more reliable than manual testing scenarios
- The second test will still see "0" initially, proving isolation works

### Test Case 2: Shared State Problem (Manual Browser Testing)

**Concept: Real-World Persistence Issues**

1. Open browser, navigate to shared-state.html
2. Set Global Counter to 10, save persistent form with name "Test User"
3. Close browser completely
4. Open new browser, navigate to shared-state.html again
5. **Expected**: Global Counter shows "10", form shows "Test User" (demonstrates why this is problematic for tests)

**Learning Points:**

- LocalStorage persists even after closing the browser (until manually cleared)
- This simulates how test data can "leak" between test runs in poorly designed test suites
- Real users might expect this behavior, but tests should not rely on it
- This shows why CI/CD systems often use fresh containers/VMs for each test run

### Test Case 3: Context Isolation Comparison

**Concept: Same Context vs Fresh Context Behavior**

**Same Context (Manual):**

1. Navigate to context.html
2. Set username to "User1", increment counter to 5
3. Navigate to shared-state.html (same tab/context)
4. Navigate back to context.html
5. **Expected**: Username and counter preserved

**Fresh Context (Playwright):**

```javascript
test("Fresh context has clean state", async ({ page }) => {
  await page.goto("context.html");
  await expect(page.getByTestId("username-input")).toHaveValue("");
  await expect(page.getByTestId("counter-value")).toHaveText("0");
});
```

**Learning Points:**

- Same browser context: State persists across navigation (can cause test coupling)
- Fresh context: Each test starts completely clean (proper test isolation)
- This comparison shows the core benefit of Playwright's context management
- Manual testing shows the problems, Playwright testing shows the solution

## Key Learning Points

1. **Manual browser testing** shows shared state problems that affect test reliability

   - Demonstrates real-world persistence issues that cause flaky tests
   - Shows how application design decisions impact test isolation

2. **Playwright's automatic context isolation** solves most of these problems

   - Fresh context per test prevents data leakage between tests
   - Eliminates most common sources of test flakiness

3. **LocalStorage/cookies persist** within the same context but reset between contexts

   - Understanding this helps design better applications and tests
   - Explains why some tests pass individually but fail when run together

4. **Good test design** includes cleanup and doesn't rely on previous test state

   - Tests should set up their own required state explicitly
   - Reset buttons/functions simulate proper test cleanup

5. **Fresh contexts** ensure each test starts with a predictable, clean state

   - This is the foundation of reliable, maintainable test suites
   - Allows tests to run in any order without affecting each other

6. **Intentional test failures** can be educational tools
   - Tests that fail due to shared state problems demonstrate the concept clearly
   - Understanding why tests fail helps developers write better isolation strategies
