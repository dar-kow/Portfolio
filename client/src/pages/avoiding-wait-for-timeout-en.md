# Avoiding waitForTimeout in Playwright Tests – Advantages, Disadvantages, and Alternatives

In our daily work on test automation, we often encounter the need to wait for certain changes in the user interface. A standard approach is to use fixed timeouts, specifically the [waitForTimeout](https://playwright.dev/docs/api/class-page#page-wait-for-timeout) method. However, such a solution can lead to issues related to test performance and stability. In this article, we'll explore why it's worth avoiding fixed timeouts, what are their advantages and disadvantages, and present alternative approaches based on dynamic waiting.

## Why Should We Avoid Fixed Timeouts?

Fixed timeouts, meaning constant delays implemented using **waitForTimeout**, have several significant limitations:

- **Suboptimal test execution time** – A fixed waiting time may be too long or too short. If we set a timeout that's too long, tests will run slower; too short, and elements might not have enough time to load.
- **Lower determinism** – Tests based on fixed waits can be unreliable because they depend on timing assumptions rather than the actual state of elements.
- **Maintenance difficulties** – When the interface changes, timeouts need to be manually adjusted in multiple places.

## Alternatives – Waiting for Specific Element States

Instead of using fixed timeouts, it's better to implement approaches based on waiting for a specific element state, such as **visible**, or for changes in element attributes. This approach increases test stability and determinism. An example is using the **waitForState** method in combination with universal helper methods:

### Example Helper Methods

#### Method for Waiting for a Value

```typescript
/**
 * Internal helper method that waits for an expected value.
 *
 * @param getValue - Function returning the current value (Promise<T | null>).
 * @param expectedValue - Expected value.
 * @param timeout - Maximum waiting time (default 5000 ms).
 * @param interval - Interval between attempts (default 100 ms).
 * @param useIncludes - If true, we check if the value contains expectedValue.
 * @returns Returns the found value or null.
 */
private static async waitForValueInternal<T>(
  getValue: () => Promise<T | null>,
  expectedValue: string,
  timeout: number = 5000,
  interval: number = 100,
  useIncludes: boolean = false
): Promise<T | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const value = await getValue();
    if (useIncludes
      ? typeof value === "string" && value.includes(expectedValue)
      : value === expectedValue) {
      return value;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return null;
}

/**
 * Public method waiting for a value.
 *
 * @param getValue - Function returning the current value.
 * @param expectedValue - Expected value.
 * @param timeout - Maximum waiting time.
 * @param interval - Interval between attempts.
 * @param useIncludes - Whether to use includes method for comparison.
 * @returns Found value.
 * @throws Error if the value doesn't appear within the given time.
 */
static async waitForValue<T>(
  getValue: () => Promise<T | null>,
  expectedValue: string,
  timeout: number = 5000,
  interval: number = 100,
  useIncludes: boolean = false
): Promise<T> {
  const value = await Pb.waitForValueInternal(getValue, expectedValue, timeout, interval, useIncludes);
  if (value === null) {
    throw new Error(`Expected value "${expectedValue}" did not appear within the timeout period`);
  }
  return value;
}

/**
 * Method returning boolean based on waiting for a value.
 *
 * @param getValue - Function returning the current value.
 * @param expectedValue - Expected value.
 * @param timeout - Maximum waiting time.
 * @param interval - Interval between attempts.
 * @param useIncludes - Whether to use includes for comparison.
 * @returns True if the value appeared, otherwise false.
 */
static async waitForValueBoolean(
  getValue: () => Promise<string | null>,
  expectedValue: string,
  timeout: number = 5000,
  interval: number = 100,
  useIncludes: boolean = false
) {
  const value = await Pb.waitForValueInternal(getValue, expectedValue, timeout, interval, useIncludes);
  return value !== null;
}
```

#### Methods Waiting for Element States

#### Below are examples of methods that don't use waitForTimeout, but wait for a specific element state:

```typescript
/**
 * Universal method that waits until an element reaches a specific state,
 * then performs a given action.
 *
 * @param locator - Locator object.
 * @param state - Expected element state (e.g., Visible).
 * @param action - Callback with the action to perform.
 * @param timeout - Maximum waiting time.
 */
private static async performAction(
  locator: Locator,
  state: LocatorState,
  action: () => Promise<void>,
  timeout: number = 5000
) {
  await this.waitForState(locator, state, timeout);
  await action();
}

/**
 * Waits until an element becomes visible, then performs a click.
 *
 * @param locator - Locator object.
 */
static async waitAndClick(locator: Locator) {
  await this.performAction(locator, LocatorState.Visible, () => locator.click());
}

/**
 * Waits until an element becomes visible, fills it with the given value,
 * performs blur, then verifies the value.
 *
 * @param locator - Locator object.
 * @param value - Value to enter.
 * @throws Error if the entered value doesn't match the expected one.
 */
static async waitAndFill(locator: Locator, value: string) {
  await this.performAction(locator, LocatorState.Visible, async () => {
    await locator.fill(value);
    await locator.blur();
  });
  const inputValue = await locator.inputValue();
  if (inputValue !== value) {
    throw new Error(`Input value mismatch: expected "${value}", but got "${inputValue}"`);
  }
}

/**
 * Method waiting for an element state.
 *
 * @param locator - Locator object.
 * @param state - Expected state.
 * @param timeout - Maximum waiting time.
 * @throws Error if the element doesn't reach the expected state.
 */
static async waitForState(locator: Locator, state: LocatorState, timeout: number = 5000): Promise<void> {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    const element = locator.nth(i);
    try {
      await element.waitFor({ state, timeout });
    } catch (error) {
      throw new Error(
        `Element at index ${i} with selector "${locator["_selector"]}" did not reach state "${state}" within ${timeout}ms.`
      );
    }
  }
}
```

#### Additionally, for situations when we're waiting for a specific number of elements to appear, this method can be helpful:

```typescript
/**
 * Waits until the number of elements matching the locator reaches a minimum value.
 *
 * @param locator - Locator object.
 * @param minCount - Minimum required number of elements.
 * @param timeout - Maximum waiting time.
 * @returns True when the condition is met.
 * @throws Error if the condition is not met.
 */
static async waitForMinimumCount(locator: Locator, minCount: number, timeout: number = 5000) {
  const startTime = Date.now();
  let currentCount = 0;

  while (Date.now() - startTime < timeout) {
    currentCount = await locator.count();
    if (currentCount >= minCount) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Expected at least ${minCount} elements, but found ${currentCount}.`);
}

```

# Advantages and Disadvantages of the Dynamic Waiting Approach

## Advantages

- **Test stability** – Actions are performed only when elements reach the expected state (e.g., become visible), which minimizes the risk of errors.
- **Better performance** – No fixed delays (hardcoded waits) means tests finish faster when elements load faster than anticipated.
- **Easier maintenance** – Changes in waiting logic can be introduced in central methods, affecting the entire test base.

## Disadvantages

- **Additional implementation** – Implementing waiting methods may require extra effort and modifications to existing code.
- **Complex debugging** – In case of failures, it may be more difficult to diagnose why an element didn't reach the expected state.
- **Possibility of unexpected timeouts** – If interface conditions change or delays occur, waiting methods may cause timeout exceedances.

## Summary

Avoiding fixed timeouts (**waitForTimeout**) in favor of dynamically waiting for specific element states significantly increases test stability and performance. By using universal helper methods that wait for specific conditions – such as element visibility, appearance of a specific value, or reaching a minimum number of elements – we can build a more deterministic test base that's resistant to minor application changes.

We encourage you to try these techniques in your Playwright projects to experience the benefits of a more intelligent approach to waiting for element states.

**Happy testing!**