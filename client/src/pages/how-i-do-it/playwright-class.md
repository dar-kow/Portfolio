## Zaawansowane Podejście Obiektowe w Testach Automatycznych z TypeScript

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Architektura Rozwiązania](#architektura-rozwiązania)
3. [Wzorce Projektowe](#wzorce-projektowe)
4. [Kluczowe Komponenty](#kluczowe-komponenty)
5. [Praktyczne Zastosowanie](#praktyczne-zastosowanie)
6. [Zarządzanie Typami i Interfejsami](#zarządzanie-typami-i-interfejsami)
7. [Zaawansowane Mechanizmy TypeScript](#zaawansowane-mechanizmy-typescript)
8. [Podsumowanie](#podsumowanie)

## Wprowadzenie

Przedstawione rozwiązanie demonstruje zaawansowane podejście do tworzenia testów automatycznych z wykorzystaniem TypeScript i Playwright. Głównym celem było stworzenie reużywalnej, łatwej w utrzymaniu i rozszerzalnej architektury do testowania interfejsu użytkownika, ze szczególnym uwzględnieniem operacji filtrowania danych w aplikacjach webowych.

Framework wykorzystuje nowoczesne praktyki projektowe takie jak:
- Programowanie zorientowane obiektowo
- Wzorzec projektowy strategii
- Abstrakcja i separacja odpowiedzialności
- Interfejsy i klasy generyczne
- Typowanie statyczne

## Architektura Rozwiązania 

Rozwiązanie opiera się na wielowarstwowej architekturze, która oddziela:

1. **Interfejsy** - definiujące kontrakty dla klas implementujących
2. **Klasy abstrakcyjne** - dostarczające bazową funkcjonalność
3. **Konkretne implementacje** - specyficzne dla testowanych widoków
4. **Klasy akcji** - implementujące logikę interakcji z UI

Diagram struktury projektu:

```
├── common/
│   ├── IElementComponents.ts      # Interfejsy podstawowe
│   ├── BaseElementComponents.ts   # Klasa abstrakcyjna
│   └── elementActions.ts          # Główna klasa akcji
├── module-specific/
│   ├── components.ts              # Konkretna implementacja dla modułu
│   └── test.ts                    # Testy dla danego modułu
└── utils/
    └── index.ts                   # Narzędzia pomocnicze
```

## Wzorce Projektowe

### 1. Wzorzec Strategii

Rozwiązanie intensywnie korzysta z wzorca strategii, gdzie różne algorytmy (strategie) są hermetyzowane i mogą być wymieniane. Przykład implementacji:

```typescript
// Strategie wypełniania różnych typów pól
const fillStrategy: Record<ElementType, (key: T, val: RandomDataValue, elementId: string) => Promise<void>> = {
  [ElementType.NUMERIC_RANGE]: this.fillNumericRange.bind(this),
  [ElementType.MULTISELECT]: this.fillMultiselect.bind(this),
  [ElementType.TEXT]: this.fillText.bind(this),
  [ElementType.DATE_RANGE]: this.fillDateRange.bind(this),
  // Inne strategie...
};

// Użycie odpowiedniej strategii
await fillStrategy[type](key, searchValue, elementId);
```

### 2. Wzorzec Szablonowy (Template Method)

Klasa abstrakcyjna `BaseElementComponents` definiuje szkielet algorytmu, delegując implementację konkretnych kroków do podklas:

```typescript
export abstract class BaseElementComponents<T extends string | number> implements IElementComponents<T> {
  // Wspólne implementacje
  public getDataFieldLocator(dataField: string): Locator {
    return this.page.locator(`[data-field="${dataField}"]`);
  }

  // Metody abstrakcyjne do implementacji przez podklasy
  abstract getFilterOptionByIndex(index: T): Locator;
  abstract getFilterTextInput(elementId: string, type?: ElementType): Locator;
  // Inne metody...
}
```

### 3. Inversion of Control i Wstrzykiwanie Zależności

Klasy akcji przyjmują zależności poprzez konstruktor, co ułatwia testowanie i zwiększa elastyczność:

```typescript
export class TestActions<T extends string | number> {
  constructor(
    private page: Page,
    private elements: IElementComponents<T>
  ) {}
  
  // Metody wykorzystujące wstrzyknięte zależności
}
```

## Kluczowe Komponenty

### IElementComponents - Interfejs Bazowy

Definiuje podstawowy kontrakt, który muszą implementować wszystkie komponenty UI:

```typescript
export interface IElementComponents<T extends string | number> {
  mainButton: Locator;
  closeIcons: Locator;
  elementDefinitions: Record<T, ElementDefinition>;

  getOptionByIndex(index: T): Locator;
  getApplyButton(elementId: string): Locator;
  getCancelButton(elementId: string): Locator;
  getInputField(elementId: string, type?: ElementType): Locator;
  getRangeInput(elementId: string, type: ElementType): { from: Locator; to: Locator };
  getDataFieldLocator(dataField: string): Locator;
}
```

### BaseElementComponents - Klasa Abstrakcyjna

Dostarcza częściową implementację interfejsu, pozostawiając specyficzne elementy do implementacji przez klasy pochodne:

```typescript
export abstract class BaseElementComponents<T extends string | number> implements IElementComponents<T> {
  abstract mainButton: Locator;
  abstract closeIcons: Locator;
  abstract elementDefinitions: Record<T, ElementDefinition>;
  
  // Implementacja wspólnych metod
  
  protected constructor(protected page: Page) {}
  
  public getDataFieldLocator(dataField: string): Locator {
    return this.page.locator(`[data-field="${dataField}"]`);
  }
  
  // Pozostałe metody abstrakcyjne...
}
```

### ModuleSpecificComponents - Konkretna Implementacja

Implementuje abstrakcyjną klasę bazową, dostarczając specyficzne dla modułu selektory i funkcje:

```typescript
export class ModuleSpecificComponents extends BaseElementComponents<TestElementIndex> {
  constructor(page: Page) {
    super(page);
  }

  // Implementacja selektorów specyficznych dla modułu
  public readonly elementDefinitions: Record<TestElementIndex, ElementDefinition> = {
    [TestElementIndex.IDENTIFIER]: {
      label: "Identyfikator",
      locator: () => this.identifierElement,
      dataField: "identifier",
      type: ElementType.TEXT,
    },
    // Inne definicje elementów...
  };
  
  // Gettery dla selektorów elementów
  get mainButton(): Locator {
    return this.page.locator(this.MAIN_BUTTON_SELECTOR);
  }
  
  // Pozostałe implementacje zgodne z interfejsem
}
```

### TestActions - Główna Klasa Akcji

Centralna klasa implementująca operacje wykonywane na elementach interfejsu:

```typescript
export class TestActions<T extends string | number> {
  constructor(
    private page: Page,
    private elements: IElementComponents<T>
  ) {}

  /**
   * Pobiera liczbę zdefiniowanych elementów.
   */
  public getElementCount(): number {
    return Object.keys(this.elements.elementDefinitions).length;
  }

  /**
   * Otwiera element i opcjonalnie przypina go.
   * @param key - Klucz elementu do otwarcia
   * @param pin - Czy element powinien zostać przypięty
   */
  public async openElement(key: T, pin: boolean = false): Promise<Locator> {
    // Implementacja
  }
  
  /**
   * Ekstrahuje wartości z pola danych na podstawie typu elementu.
   */
  public async extractAllDataValues(elementIndex: T, option: TestOption): Promise<string[]> {
    // Implementacja ekstrakcji danych
  }
  
  // Inne metody akcji...
}
```

## Praktyczne Zastosowanie

Przykład testu wykorzystującego stworzoną architekturę:

```typescript
test("Element1.GivenUserIsOnPage_WhenApplyingFilter_ThenListIsFiltered @regression", async () => {
  // ARRANGE
  const elementIndex = TestElementIndex.IDENTIFIER;
  const searchValue = await testActions.getRandomValue(elementIndex);

  // ACT
  await testActions.applyElementAndCompareLabel(elementIndex, searchValue);
  const result = await testActions.verifyFilteredResults(elementIndex, searchValue);

  // ASSERT
  expect(result).toBeTruthy();
});
```

## Zarządzanie Typami i Interfejsami

### Typy Wyliczeniowe (Enums)

Definiują dostępne opcje i stany:

```typescript
export enum ElementType {
  TEXT = "text",
  MULTISELECT = "multiselect", 
  NUMERIC_RANGE = "numericRange",
  DATE_RANGE = "dateRange",
  SWITCH = "switch",
  STATUS = "status",
}

export enum TestOption {
  SHORT_TEXT = "SHORT_TEXT",
  FULL_TEXT = "FULL_TEXT", 
  WITH_EMPTY = "WITH_EMPTY",
}

export enum RangeOption {
  Both = "both",
  FromOnly = "fromOnly",
  ToOnly = "toOnly", 
}
```

### Strażnicy Typów (Type Guards)

Zapewniają bezpieczne operacje na typach:

```typescript
// Typ złożony
type RandomDataValue = string | { from: number; to: number } | { from: string; to: string } | null;

// Strażnicy typu
function isRangeValue(val: any): val is { from: string; to: string } {
  return typeof val === "object" && val !== null && "from" in val && "to" in val;
}

function isStringValue(val: any): val is string {
  return typeof val === "string";
}

// Przykład użycia
if (isRangeValue(value)) {
  // TypeScript wie, że value ma właściwości from i to
  console.log(value.from, value.to);
} else if (isStringValue(value)) {
  // TypeScript wie, że value jest stringiem
  console.log(value.toUpperCase());
}
```

## Zaawansowane Mechanizmy TypeScript

### Typy Generyczne

Rozwiązanie intensywnie wykorzystuje typy generyczne do zapewnienia elastyczności i typowej bezpieczeństwa:

```typescript
export class TestActions<T extends string | number> {
  // T jest parametrem generycznym ograniczonym do string lub number
  // Umożliwia to używanie enumów jako indeksów do obiektów
}
```

### Mapowanie Typów i Rekordy

Używane do tworzenia typów obiektów o dynamicznych kluczach:

```typescript
// Dynamiczne mapowanie typów
const rangeExtractors: { [key in ElementType]?: (values: string[], side: RangeOption) => RandomDataValue } = {
  [ElementType.NUMERIC_RANGE]: this.getNumericRangeValue.bind(this),
  [ElementType.DATE_RANGE]: this.getDateRangeValue.bind(this),
};

// Typowe rekordy
private labelFormatters: Record<ElementType, (label: string, value: RandomDataValue) => string> = {
  [ElementType.TEXT]: (label, value) => `${label}:Contains "${value}"`,
  [ElementType.NUMERIC_RANGE]: (label, value) => {
    // Implementacja formatowania dla zakresu liczbowego
  },
  // Inne formatery...
};
```

### Destrukturyzacja i Spread

Używane do czytelnej manipulacji obiektami:

```typescript
// Destrukturyzacja
const { searchArea, applyButton } = await this.getElementLocators(elementId, type);

// Spread operator
const filteredTexts = Array.from(new Set([...existingTexts, ...additionalTexts]));
```

## Podsumowanie

Przedstawione rozwiązanie demonstruje zaawansowane umiejętności programistyczne w zakresie:

1. **Projektowania obiektowego** - prawidłowe zastosowanie dziedziczenia, interfejsów i abstrakcji
2. **Typowania** - skuteczne wykorzystanie systemu typów TypeScript w celu zapewnienia bezpieczeństwa typów
3. **Wzorców projektowych** - implementacja uznanych wzorców w celu zwiększenia elastyczności i reużywalności kodu
4. **Clean Code** - strukturyzacja kodu zgodnie z zasadami SOLID i DRY
5. **Testowania** - testy czytelne, zwięzłe i łatwe w utrzymaniu

Rozwiązanie to można łatwo rozszerzać o nowe moduły i typy elementów, zachowując spójność architektury i wysoką jakość kodu.

---
