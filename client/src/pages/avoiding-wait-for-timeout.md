# Unikanie waitForTimeout w testach Playwright – Zalety, wady i alternatywy

W codziennej pracy nad automatyzacją testów często spotykamy się z koniecznością oczekiwania na pewne zmiany w interfejsie użytkownika. Standardowym podejściem bywa używanie sztywnych timeoutów, czyli metody [waitForTimeout](https://playwright.dev/docs/api/class-page#page-wait-for-timeout), jednak takie rozwiązanie może prowadzić do problemów związanych z wydajnością i stabilnością testów. W tym artykule przyjrzymy się, dlaczego warto unikać sztywnych timeoutów, jakie są ich zalety i wady oraz przedstawimy alternatywne podejścia oparte na dynamicznym oczekiwaniu.

## Dlaczego nie warto używać sztywnych timeoutów?

Sztywne timeouty, czyli stałe opóźnienia wprowadzane za pomocą **waitForTimeout**, mają kilka istotnych ograniczeń:

- **Nieoptymalny czas wykonania testów** – Ustalony czas oczekiwania może być zbyt długi lub za krótki. Jeśli ustawimy zbyt długi timeout, testy będą wykonywały się wolniej; zbyt krótki może spowodować, że elementy nie zdążą się załadować.
- **Niższa deterministyczność** – Testy oparte na sztywnych czeknięciach mogą być zawodnymi, gdyż opierają się na założeniach dotyczących czasu, a nie na faktycznym stanie elementów.
- **Trudności w utrzymaniu** – W przypadku zmian w interfejsie, konieczne jest ręczne modyfikowanie timeoutów w wielu miejscach.

## Alternatywy – oczekiwanie na konkretny stan elementu

Zamiast korzystać z sztywnych timeoutów, warto wdrożyć podejścia oparte na oczekiwaniu na określony stan elementu, na przykład **visible**, lub na zmianę atrybutów elementu. Takie podejście zwiększa stabilność i deterministyczność testów. Przykładem może być wykorzystanie metody **waitForState** w połączeniu z uniwersalnymi metodami pomocniczymi:

### Przykładowe metody pomocnicze

#### Metoda oczekująca na wartość

```typescript
/**
 * Wewnętrzna metoda pomocnicza, która czeka na oczekiwaną wartość.
 *
 * @param getValue - Funkcja zwracająca aktualną wartość (Promise<T | null>).
 * @param expectedValue - Oczekiwana wartość.
 * @param timeout - Maksymalny czas oczekiwania (domyślnie 5000 ms).
 * @param interval - Interwał pomiędzy kolejnymi próbami (domyślnie 100 ms).
 * @param useIncludes - Jeśli true, sprawdzamy czy wartość zawiera expectedValue.
 * @returns Zwraca znalezioną wartość lub null.
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
 * Publiczna metoda oczekująca na wartość.
 *
 * @param getValue - Funkcja zwracająca aktualną wartość.
 * @param expectedValue - Oczekiwana wartość.
 * @param timeout - Maksymalny czas oczekiwania.
 * @param interval - Interwał pomiędzy próbami.
 * @param useIncludes - Czy używać metody includes przy porównaniu.
 * @returns Znaleziona wartość.
 * @throws Błąd, jeśli wartość nie pojawi się w zadanym czasie.
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
 * Metoda zwracająca boolean w oparciu o oczekiwanie na wartość.
 *
 * @param getValue - Funkcja zwracająca aktualną wartość.
 * @param expectedValue - Oczekiwana wartość.
 * @param timeout - Maksymalny czas oczekiwania.
 * @param interval - Interwał pomiędzy próbami.
 * @param useIncludes - Czy używać includes przy porównaniu.
 * @returns True, jeśli wartość pojawiła się, w przeciwnym razie false.
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

#### Metody oczekujące na stan elementu

#### Poniżej przedstawiamy przykłady metod, które nie używają waitForTimeout, lecz czekają na określony stan elementu:

```typescript
/**
 * Uniwersalna metoda, która czeka, aż element osiągnie określony stan,
 * a następnie wykonuje zadaną akcję.
 *
 * @param locator - Obiekt Locator.
 * @param state - Oczekiwany stan elementu (np. Visible).
 * @param action - Callback z akcją do wykonania.
 * @param timeout - Maksymalny czas oczekiwania.
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
 * Czeka aż element stanie się widoczny, a następnie wykonuje kliknięcie.
 *
 * @param locator - Obiekt Locator.
 */
static async waitAndClick(locator: Locator) {
  await this.performAction(locator, LocatorState.Visible, () => locator.click());
}

/**
 * Czeka, aż element stanie się widoczny, wypełnia go podaną wartością,
 * wykonuje blur, a następnie weryfikuje wartość.
 *
 * @param locator - Obiekt Locator.
 * @param value - Wartość do wpisania.
 * @throws Błąd, jeśli wartość wpisana nie odpowiada oczekiwanej.
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
 * Metoda oczekująca na stan elementu.
 *
 * @param locator - Obiekt Locator.
 * @param state - Oczekiwany stan.
 * @param timeout - Maksymalny czas oczekiwania.
 * @throws Błąd, jeśli element nie osiągnie oczekiwanego stanu.
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

#### Dodatkowo, dla sytuacji gdy oczekujemy na pojawienie się określonej liczby elementów, pomocna może być metoda:

```typescript
/**
 * Czeka, aż liczba elementów odpowiadających locatorowi osiągnie minimalną wartość.
 *
 * @param locator - Obiekt Locator.
 * @param minCount - Minimalna wymagana liczba elementów.
 * @param timeout - Maksymalny czas oczekiwania.
 * @returns True, gdy warunek zostanie spełniony.
 * @throws Błąd, jeśli warunek nie zostanie spełniony.
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

# Zalety i wady podejścia opartego na dynamicznym oczekiwaniu

## Zalety

- **Stabilność testów** – Akcje są wykonywane dopiero, gdy elementy osiągną oczekiwany stan (np. stają się widoczne), co minimalizuje ryzyko wystąpienia błędów.
- **Lepsza wydajność** – Brak sztywnych opóźnień (hardcoded wait) sprawia, że testy kończą się szybciej, gdy elementy ładują się szybciej niż zakładano.
- **Łatwiejsze utrzymanie** – Zmiany w logice oczekiwania można wprowadzić w centralnych metodach, co wpływa na całą bazę testów.

## Wady

- **Dodatkowa implementacja** – Wdrożenie metod oczekujących może wymagać dodatkowego wysiłku i modyfikacji istniejącego kodu.
- **Skomplikowane debugowanie** – W przypadku awarii może być trudniej zdiagnozować, dlaczego element nie osiągnął oczekiwanego stanu.
- **Możliwość nieoczekiwanych timeoutów** – Jeśli warunki w interfejsie ulegną zmianie lub wystąpią opóźnienia, metody oczekujące mogą spowodować przekroczenie czasu oczekiwania.

## Podsumowanie

Unikanie sztywnych timeoutów (**waitForTimeout**) na rzecz dynamicznego oczekiwania na określony stan elementów znacząco podnosi stabilność i wydajność testów. Stosując uniwersalne metody pomocnicze, które czekają na określone warunki – takie jak widoczność elementów, pojawienie się konkretnej wartości lub osiągnięcie minimalnej liczby elementów – możemy zbudować bardziej deterministyczną i odporną na drobne zmiany aplikacji bazę testów.

Zachęcamy do wypróbowania przedstawionych technik w swoich projektach Playwright, by doświadczyć korzyści płynących z bardziej inteligentnego podejścia do oczekiwania na stan elementów.

**Miłego testowania!**
