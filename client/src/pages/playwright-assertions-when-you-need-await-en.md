# Assertions in Playwright: When Do You Actually Need await?

## Introduction

In the world of automated testing for web applications, Playwright has become one of the most popular tools. However, even experienced QA engineers may have doubts about the correct use of assertions, especially when it comes to using the ***await*** keyword. I often hear the opinion that "every assertion in Playwright requires await, otherwise the test will be unstable." Is this really the case?

In this article, I'll debunk this myth and explain when ***await*** is essential and when it's completely unnecessary—all backed by official documentation and code analysis.

## Two Types of Assertions in Playwright

Let's start with the key information: Playwright has two fundamentally different types of assertions:

### 1. Auto-Retrying Assertions (requiring ***await***)

These assertions are **asynchronous** and automatically retried. They will try to verify the condition multiple times until it is met or the timeout expires (default is 5 seconds). Examples:

```typescript
await expect(locator).toBeVisible();
await expect(page).toHaveURL(expectedUrl);
await expect(locator).toHaveText('Expected text');
```

The documentation clearly states that "retrying assertions are async, so you must await them."

### 2. Non-Retrying Assertions (not requiring ***await***)

These assertions work synchronously, verifying values that we already have in memory:

```typescript
expect(value).toBe(5);
expect(array).toContain('element');
expect(object).toHaveProperty('name');
```

These assertions **do not require ***await***** because they don't perform any asynchronous operations. They are just simple value comparisons.

## Code Analysis and Step-by-Step Execution

Let's look at an example test:

```typescript
test("When_userClicksButton_Then_correctPageOpens", async ({ page }) => {
  // Arrange & Act
  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Click me' }).click();

  // Assert
  await expect(page).toHaveURL('https://example.com/destination');
  const headingText = await page.locator('h1').textContent();
  expect(headingText?.trim()).toBe('Welcome to Destination');
});
```

Let's analyze the execution of this test step by step:

1. The test opens the example.com page
2. The test clicks the "Click me" button
3. **Assertion 1**: The test checks the page URL using `await expect(page).toHaveURL(...)`
   - This is an asynchronous assertion (auto-retrying)
   - It will attempt to check the URL multiple times until it matches the expectation
   - **Requires ***await*** for the test to wait for the condition to be met**
4. The test retrieves the heading text using `await page.locator('h1').textContent()`
   - This is an asynchronous operation because it requires communication with the browser
   - **Requires ***await*** to wait for the text to be retrieved**
5. **Assertion 2**: The test compares the retrieved text using `expect(headingText?.trim()).toBe(...)`
   - This is a synchronous assertion (non-retrying)
   - It operates on a value that has already been retrieved in step 4
   - **Does not require ***await*** because there is no asynchronous operation here**

## Why Omitting ***await*** in the Second expect is Correct?

The crucial fact here is that in step 4 we've already asynchronously retrieved the header content. By the time we execute the assertion in step 5, the `headingText` value is already available in our test's memory. We're not performing any operation that would require communication with the browser.

In this case, adding ***await*** before `expect(headingText?.trim()).toBe(...)` would not only be unnecessary but even misleading, as it would suggest that we're performing some asynchronous operation here, which is not true.

## When Does Omitting ***await*** Actually Cause Problems?

Test stability issues occur when we don't use ***await*** for auto-retrying assertions:

```typescript
// Bad - missing await for auto-retrying assertion
expect(page).toHaveURL('https://example.com/destination'); // Error! Should be await
```

In the above case, the test won't wait for the URL to change and may continue execution even if the page hasn't loaded yet, leading to unstable tests.

## What Does the Official Documentation Say?

Playwright's documentation is very clear on this matter. In the "Auto-retrying assertions" section, it lists assertions that require ***await***, and in the "Non-retrying assertions" section, those that don't.

Moreover, the documentation explicitly states:

> "These assertions [non-retrying] allow to test any conditions, but do not auto-retry."

This means that these assertions are designed precisely for testing conditions without auto-retrying, which is exactly what we need when comparing already retrieved values.

## Conclusions

The myth that "every assertion in Playwright must use await" is false and stems from a misunderstanding of the differences between assertion types. The correct approach is:

1. Use ***await*** for auto-retrying assertions that communicate with the browser
2. Don't use ***await*** for simple comparisons of values you already have in memory

Following these principles will allow you to write more readable, efficient, and precise tests that accurately reflect your intentions. Remember that good test code should be readable and unambiguous—adding unnecessary ***await*** where it's not needed only obscures the actual intentions of the test.

---

*Article based on the official Playwright documentation available at playwright.dev*