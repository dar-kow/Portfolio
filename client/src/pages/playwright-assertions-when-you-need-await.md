# Asercje w Playwright: Kiedy faktycznie potrzebujesz await?

## Wprowadzenie

W świecie testów automatycznych dla aplikacji webowych, Playwright stał się jednym z najpopularniejszych narzędzi. Jednak nawet doświadczeni inżynierowie QA mogą mieć wątpliwości dotyczące prawidłowego używania asercji, zwłaszcza gdy chodzi o stosowanie słowa kluczowego ***await***. Często słyszę opinię, że "każda asercja w Playwright wymaga await, inaczej test będzie niestabilny". Czy rzeczywiście tak jest?

W tym artykule obalę ten mit i wyjaśnię, kiedy ***await*** jest niezbędny, a kiedy kompletnie zbędny — wszystko poparte oficjalną dokumentacją i analizą kodu.

## Dwa typy asercji w Playwright

Zacznijmy od kluczowej informacji: Playwright posiada dwa fundamentalnie różne typy asercji:

### 1. Asercje Auto-Retrying (wymagające ***await***)

Te asercje są **asynchroniczne** i automatycznie ponawiane. Będą próbowały weryfikować warunek wielokrotnie, aż zostanie spełniony lub upłynie limit czasu (domyślnie 5 sekund). Przykłady:

```typescript
await expect(locator).toBeVisible();
await expect(page).toHaveURL(expectedUrl);
await expect(locator).toHaveText('Oczekiwany tekst');
```

Dokumentacja wyraźnie wskazuje, że "asercje z auto-retrying są asynchroniczne, więc musisz używać await" (tłum. własne: "Note that retrying assertions are async, so you must await them").

### 2. Asercje Non-Retrying (nie wymagające ***await***)

Te asercje działają synchronicznie, weryfikując wartości, które już mamy w pamięci:

```typescript
expect(value).toBe(5);
expect(array).toContain('element');
expect(object).toHaveProperty('name');
```

Te asercje **nie wymagają ***await*****, ponieważ nie wykonują żadnych operacji asynchronicznych. Są to zwykłe porównania wartości.

## Analiza kodu i wykonanie krok po kroku

Przyjrzyjmy się przykładowemu testowi:

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

Przeanalizujmy wykonanie tego testu krok po kroku:

1. Test otwiera stronę example.com
2. Test klika przycisk "Click me"
3. **Asercja 1**: Test sprawdza URL strony za pomocą `await expect(page).toHaveURL(...)` 
   - Jest to asercja asynchroniczna (auto-retrying)
   - Będzie próbowała sprawdzić URL wielokrotnie, aż będzie zgodny z oczekiwaniem
   - **Wymaga ***await***, aby test zaczekał na spełnienie warunku**
4. Test pobiera tekst nagłówka za pomocą `await page.locator('h1').textContent()`
   - Jest to operacja asynchroniczna, ponieważ wymaga komunikacji z przeglądarką
   - **Wymaga ***await***, aby zaczekać na pobranie tekstu**
5. **Asercja 2**: Test porównuje pobrany tekst za pomocą `expect(headingText?.trim()).toBe(...)`
   - Jest to asercja synchroniczna (non-retrying)
   - Operuje na wartości, która już została pobrana w kroku 4
   - **Nie wymaga ***await***, ponieważ nie ma tu żadnej operacji asynchronicznej**

## Dlaczego brak ***await*** w drugim expect jest poprawny?

Kluczowy jest tutaj fakt, że w kroku 4 już pobraliśmy zawartość nagłówka asynchronicznie. W momencie wykonania asercji w kroku 5, wartość `headingText` jest już dostępna w pamięci naszego testu. Nie wykonujemy żadnej operacji, która wymagałaby komunikacji z przeglądarką.

W takim przypadku dodanie ***await*** przed `expect(headingText?.trim()).toBe(...)` byłoby nie tylko zbędne, ale wręcz wprowadzające w błąd, ponieważ sugerowałoby, że wykonujemy tu jakąś operację asynchroniczną, co nie jest prawdą.

## Kiedy brak ***await*** faktycznie powoduje problemy?

Problemy z stabilnością testów występują, gdy nie używamy ***await*** dla asercji auto-retrying:

```typescript
// Źle - brak await przy asercji auto-retrying
expect(page).toHaveURL('https://example.com/destination'); // Błąd! Powinno być await
```

W powyższym przypadku test nie zaczeka na zmianę URL i może kontynuować wykonanie, nawet jeśli strona jeszcze się nie załadowała, co prowadzi do niestabilnych testów.

## Co mówi oficjalna dokumentacja?

Dokumentacja Playwright jest w tej kwestii bardzo jasna. W sekcji "Auto-retrying assertions" wymienia asercje, które wymagają ***await***, a w sekcji "Non-retrying assertions" te, które go nie wymagają.

Co więcej, dokumentacja wyraźnie stwierdza:

> "These assertions [non-retrying] allow to test any conditions, but do not auto-retry."

Oznacza to, że asercje te są przeznaczone właśnie do testowania warunków bez auto-ponawiania, co jest dokładnie tym, czego potrzebujemy w przypadku porównywania już pobranych wartości.

## Wnioski

Mit, że "każda asercja w Playwright musi używać await" jest nieprawdziwy i wynika z niezrozumienia różnic między typami asercji. Prawidłowe podejście to:

1. Używaj ***await*** dla asercji auto-retrying, które komunikują się z przeglądarką
2. Nie używaj ***await*** dla prostych porównań wartości, które już masz w pamięci

Stosowanie tych zasad pozwoli pisać bardziej czytelne, wydajne i precyzyjne testy, które dokładnie odzwierciedlają twoje intencje. Pamiętaj, że dobry kod testowy powinien być czytelny i jednoznaczny - dodawanie zbędnych ***await*** tam, gdzie nie są potrzebne, tylko zaciemnia faktyczne intencje testu.

---

*Artykuł oparty na oficjalnej dokumentacji Playwright dostępnej na stronie playwright.dev*