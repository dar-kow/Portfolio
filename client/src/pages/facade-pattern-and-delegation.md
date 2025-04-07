# Refaktoryzacja dużych plików testowych: <br>Wzorzec Fasady i Delegacje jako sposób na uporządkowanie chaosu

Gdy projekty rozrastają się, klasy testowe często przekształcają się w monolityczne kolosy pełne powtarzającego się kodu. W tym artykule omówimy strategię refaktoryzacji dużych plików z akcjami testowymi, wykorzystując wzorzec fasady i delegacje, aby utrzymać porządek i skalowalność.

## Stan przed refaktoryzacją: anatomia chaosu

Analizując dostarczony kod, widzimy typowy przykład problemu - klasa ***SaleActions*** w pliku ***old-actions.ts*** liczy ponad 1500 linii kodu. Jest to klasyczny "God Object" zawierający:

- Metody nawigacji interfejsu
- Metody wypełniania formularzy
- Obliczenia cenowe i rabatowe
- Akcje zatwierdzania i weryfikacji
- Manipulacje koszykiem zakupowym
- Obsługę płatności

Problemy takiego podejścia są oczywiste:
1. **Trudność w utrzymaniu** - pojedyncza zmiana wymaga zrozumienia całej klasy
2. **Ryzyko konfliktów** - wielu deweloperów pracujących nad tym samym plikiem
3. **Trudność w debugowaniu** - problemy są trudne do zlokalizowania
4. **Naruszenie zasad SOLID** - szczególnie Single Responsibility Principle
5. **Bariera wejścia** - nowi członkowie zespołu czują się przytłoczeni

## Architektura po refaktoryzacji: fasada i delegacje

Refaktoryzacja wprowadza wzorzec fasady, zachowując istniejący interfejs klasy ***SaleActions***, ale delegując konkretne operacje do wyspecjalizowanych klas:

```typescript
export class SaleActions {
  // Moduły z nowej struktury
  private basketTableManager: BasketTableManager;
  private processActions: ProcessActions.SaleProcessActions;
  private paymentActions: ProcessActions.PaymentActions;
  private contractorActions: ProcessActions.ContractorActions;
  private itemPriceActions: ItemActions.ItemPriceActions;
  private itemDiscountActions: ItemActions.ItemDiscountActions;
  private itemManagementActions: ItemActions.ItemManagementActions;
  private loaderActions: CommonActions.LoaderActions;
  private uiActions: CommonActions.UIActions;

  constructor(private page: Page) {
    // Inicjalizacja wszystkich modułów...
  }

  // Delegacje do odpowiednich modułów...
  async collectBasketData(): Promise<BasketItem[]> {
    return this.basketTableManager.collectBasketData();
  }

  async createNewSale(): Promise<void> {
    return this.processActions.createNewSale();
  }

  // Inne delegacje...
}
```

Powyższy kod pokazuje główną klasę ***SaleActions***, która działa teraz jako fasada. Zamiast implementować wszystkie metody, deleguje wywołania do wyspecjalizowanych klas:

1. **BasketTableManager** - zarządzanie tabelą koszyka
2. **ProcessActions** - procesy sprzedaży i płatności
3. **ItemActions** - zarządzanie elementami, cenami i rabatami
4. **CommonActions** - wspólne operacje UI i ładowania

## Zalety nowego podejścia

### 1. Łatwiejsze utrzymanie i rozwój

Każda klasa ma teraz jasno określoną odpowiedzialność, co ułatwia znajdowanie i modyfikowanie kodu. Nowe funkcjonalności można dodawać w odpowiednich modułach bez dotykania całego systemu.

### 2. Lepsza organizacja kodu

Struktura modułowa pozwala łatwiej zrozumieć system:

```
SaleActions/
├── common/
│   ├── loader-actions.ts
│   └── ui-actions.ts
├── item/
│   ├── item-discount-actions.ts
│   ├── item-management-actions.ts
│   └── item-price-actions.ts
├── process/
│   ├── contractor-actions.ts
│   ├── payment-actions.ts
│   └── sale-process-actions.ts
└── table/
    ├── basket-action-executor.ts
    ├── basket-data-extractor.ts
    ├── basket-table-manager.ts
    └── basket-table-navigator.ts
```

### 3. Łatwiejsze testowanie

Mniejsze, wyspecjalizowane klasy są łatwiejsze do testowania jednostkowego. Możemy teraz testować działanie ***BasketDataExtractor*** niezależnie od reszty systemu.

### 4. Zgodność z SOLID

- **Single Responsibility** - każda klasa ma jedną odpowiedzialność
- **Open/Closed** - rozszerzanie funkcjonalności bez modyfikacji istniejącego kodu
- **Liskov Substitution** - interfejsy umożliwiają podmiany implementacji
- **Interface Segregation** - małe, dedykowane interfejsy
- **Dependency Inversion** - zależności poprzez abstrakcje

### 5. Ułatwione wdrażanie nowych członków zespołu

Nowi deweloperzy mogą skupić się na zrozumieniu jednego modułu, zamiast całego systemu. 

## Potencjalne wady i wyzwania

### 1. Złożoność struktury

Wprowadzenie wielu klas i interfejsów zwiększa złożoność strukturalną projektu. Może to utrudniać zrozumienie przepływu danych dla osób niezaznajomionych z wzorcem.

### 2. Koszty refaktoryzacji

Przekształcenie istniejącego systemu wymaga czasu i uwagi. Istnieje ryzyko wprowadzenia błędów podczas przenoszenia kodu.

### 3. Potencjalna nadmiarowość

Wprowadzenie delegacji może prowadzić do nadmiernej warstwy pośredniej:

```typescript
// Przykład potencjalnej nadmiarowości
async createNewSale(): Promise<void> {
  return this.processActions.createNewSale();
}
```

### 4. Zarządzanie stanem

Rozproszone klasy mogą utrudniać zarządzanie współdzielonym stanem. Konieczne może być wprowadzenie mechanizmów synchronizacji.

## Strategiczne podejście do refaktoryzacji

### 1. Analiza istniejącego kodu

Zanim zaczniesz, przeanalizuj istniejący kod, identyfikując naturalne klastry funkcjonalności. W naszym przypadku wyodrębniliśmy operacje na tabeli, zarządzanie elementami i procesy sprzedaży.

### 2. Stopniowa implementacja

Zamiast refaktoryzować wszystko naraz, lepiej pracować iteracyjnie:

1. Wyodrębnij jedną grupę funkcjonalności (np. operacje na tabeli)
2. Zbuduj nową klasę i przenieś do niej kod
3. Zastosuj delegacje w głównej klasie
4. Uruchom testy, aby upewnić się, że wszystko działa poprawnie
5. Przejdź do kolejnej grupy funkcjonalności

### 3. Budowanie na interfejsach

Wykorzystaj interfejsy do określenia kontraktów między komponentami:

```typescript
export interface TableActionExecutor {
  openRowMenu(rowIndex: string | number): Promise<void>;
  executeAction(actionId: string): Promise<void>;
  // inne metody...
}

export class BasketActionExecutor implements TableActionExecutor {
  // implementacja...
}
```

### 4. Zachowanie kompatybilności

Zasadnicze jest zachowanie istniejącego interfejsu publicznego głównej klasy, aby testy nie wymagały modyfikacji:

```typescript
// Przed refaktoryzacją
await saleActions.clickChangePriceButton();

// Po refaktoryzacji - taki sam interfejs, inna implementacja
async clickChangePriceButton(): Promise<void> {
  return this.itemPriceActions.clickChangePriceButton();
}
```

## DRY vs YAGNI w kontekście refaktoryzacji

Podczas refaktoryzacji często napotykamy napięcie między zasadami DRY (Don't Repeat Yourself) i YAGNI (You Aren't Gonna Need It):

**DRY**: Eliminacja duplikacji kodu prowadzi do tworzenia abstrakcji, co widać w naszych klasach ***BasketTableNavigator*** czy ***BasketDataExtractor***.

**YAGNI**: Nadmierna abstrakcja może prowadzić do niepotrzebnej złożoności. Czasem prosta metoda w jednej klasie jest lepsza niż skomplikowana hierarchia klas.

Rozsądne podejście to:
1. Eliminacja oczywistych duplikacji
2. Tworzenie abstrakcji tylko tam, gdzie przynoszą wyraźne korzyści
3. Opóźnienie tworzenia zaawansowanych abstrakcji do momentu, gdy wzorce staną się jasne

## Wnioski praktyczne

1. **Zacznij od jasnego planu** - mapa refaktoryzacji pomoże utrzymać kierunek zmian

2. **Testuj na bieżąco** - każda zmiana powinna być weryfikowana przez testy

3. **Dokumentuj zmiany** - dobrze napisane komentarze i dokumentacja ułatwią zrozumienie nowej struktury

4. **Rozważ użycie narzędzi** - automatyzacja może pomóc w bezpiecznej refaktoryzacji

5. **Komunikuj zmiany zespołowi** - wszyscy powinni rozumieć nową architekturę

## Podsumowanie

Wzorzec fasady i delegacje stanowią potężne narzędzie w refaktoryzacji dużych, monolitycznych klas testowych. Choć proces ten wymaga starannego planowania i wykonania, korzyści w postaci łatwiejszego utrzymania, testowania i rozszerzania kodu są warte wysiłku.

Pamiętajmy jednak, że refaktoryzacja nie jest celem samym w sobie, ale środkiem do tworzenia lepszego, bardziej utrzymywalnego kodu. Kluczem jest znalezienie równowagi między idealną abstrakcją a praktyczną użytecznością, mając zawsze na uwadze potrzeby zespołu i projektu.