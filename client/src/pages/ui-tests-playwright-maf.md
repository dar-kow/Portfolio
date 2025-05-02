# Korzyści z Architektury Warstwowej w Testach E2E: POM i Vertical Slice

Architektura testów automatycznych ma kluczowe znaczenie dla ich utrzymywalności i skalowalności. Analizując przedstawiony projekt testów E2E dla aplikacji MAF zbudowany z wykorzystaniem Playwright i TypeScript, możemy zauważyć zastosowanie hybrydowego podejścia łączącego Page Object Model (POM) z architekturą Vertical Slice. Przyjrzyjmy się dokładniej tej architekturze i jej zaletom.

[Repo - in progress](https://github.com/dar-kow/maf-e2e-pw)

## Hybrydowe podejście: POM + Vertical Slice

Projekt MAF E2E wykorzystuje dwa popularne wzorce architektoniczne:

### Page Object Model (POM)

POM to klasyczny wzorzec projektowy w testach UI, który:

- Enkapsuluje interakcje z interfejsem użytkownika w dedykowane klasy
- Oddziela logikę testową od szczegółów implementacji UI
- Tworzy abstrakcję nad elementami interfejsu

### Architektura Vertical Slice

Zamiast organizowania kodu według warstw technicznych (np. wszystkie selektory razem, wszystkie akcje razem), projekt organizuje kod według funkcji (features):

- Każda funkcjonalność (np. Sidebar, Navbar) ma własny, samodzielny katalog
- Wszystkie komponenty potrzebne do testowania danej funkcji znajdują się razem
- Zapewnia lepszą spójność i mniejsze powiązania między modułami

## Struktura projektu

```
tests/
├── sidebar/           # Vertical slice dla Sidebar
│   ├── actions.ts     # Interakcje UI
│   ├── components.ts  # Selektory elementów
│   ├── data.ts        # Dane testowe
│   └── test.ts        # Specyfikacje testów
├── navbar/            # Vertical slice dla Navbar
    ├── actions.ts
    ├── components.ts
    ├── data.ts
    └── test.ts
```

## Rola poszczególnych plików

### components.ts - Centralizacja selektorów

Plik `components.ts` zawiera wszystkie selektory potrzebne do lokalizacji elementów UI:

```typescript
export const SidebarComponents = {
    root: '[data-testid="sidebar-root"]',
    toggle: '[data-testid="sidebar-toggle"]',
    // ...pozostałe selektory
};
```

**Korzyści**:
- Centralizacja selektorów w jednym miejscu
- Łatwa aktualizacja w przypadku zmian w UI
- Czytelne nazewnictwo elementów
- Możliwość reużycia tych samych selektorów w różnych testach

### data.ts - Izolacja danych testowych

Plik `data.ts` przechowuje wszystkie dane testowe, oczekiwane wartości i stałe:

```typescript
export const SidebarData = {
    title: 'M-A-F',
    subtitle: 'Moja Aplikacja Faktur',
    menuItems: {
        dashboard: 'Dashboard',
        invoices: 'Faktury',
        contractors: 'Kontrahenci',
    },
    // ...pozostałe dane
};
```

**Korzyści**:
- Separacja danych od logiki testowej
- Łatwa modyfikacja oczekiwanych wartości
- Spójność testów (te same wartości używane konsekwentnie)
- Łatwiejsze przystosowanie testów do różnych środowisk

### actions.ts - Metody interakcji bez asercji

Plik `actions.ts` zawiera metody interakcji z aplikacją, bez asercji:

```typescript
export class SidebarActions {
    // ...
    async toggleSidebar() {
        await this.page.click(SidebarComponents.toggle);
    }
    
    async isSidebarCollapsed() {
        const sidebar = await this.page.$(SidebarComponents.root);
        return await sidebar?.evaluate(el => el.classList.contains('sidebar-collapsed'));
    }
    // ...pozostałe metody
}
```

**Korzyści**:
- Abstrakcja interakcji z UI
- Reużywalność metod w różnych testach
- Kod łatwiejszy w utrzymaniu - zmiany w UI wymagają modyfikacji tylko w jednym miejscu
- Czytelniejsze testy, skupione na zachowaniu, a nie technicznej implementacji

### test.ts - Testy z asercjami

Plik `test.ts` zawiera właściwe testy z asercjami:

```typescript
test("TC-SB-003: should collapse and expand sidebar correctly", async () => {
    // Arrange - Ensure sidebar is expanded initially
    // ...
    
    // Assert - Expanded state verification
    expect(await sidebarActions.isSidebarCollapsed()).toBeFalsy();
    expect(await sidebarActions.areTitlesVisible()).toBeTruthy();
    // ...
    
    // Act - Collapse sidebar
    await sidebarActions.toggleSidebar();
    // ...
    
    // Assert - Collapsed state verification
    expect(await sidebarActions.isSidebarCollapsed()).toBeTruthy();
    // ...
});
```

**Korzyści**:
- Testy skoncentrowane na konkretnych zachowaniach
- Czytelna struktura Arrange-Act-Assert
- Wyraźne oddzielenie logiki testowej od szczegółów implementacji
- Łatwiejsze zrozumienie intencji testu

## Wzorzec Early Return

Projekt korzysta również z wzorca "Early Return" zamiast złożonych struktur warunkowych:

```typescript
// Wzorzec early return
async isSidebarCollapsed() {
    const sidebar = await this.page.$(SidebarComponents.root);
    return await sidebar?.evaluate(el => el.classList.contains('sidebar-collapsed'));
}

// Zamiast złożonych struktur if/else
async toggleAction() {
    if (await this.someCondition()) {
        // zrób coś
    } else {
        // zrób coś innego
    }
}
```

**Korzyści**:
- Lepsza czytelność kodu
- Zmniejszona złożoność cyklomatyczna
- Mniej poziomów zagnieżdżenia
- Jasne ścieżki wykonania

## Kluczowe korzyści z tego podejścia

### 1. Zwiększona utrzymywalność

- Zmiany w UI wymagają aktualizacji tylko w jednym miejscu (components.ts)
- Modyfikacja oczekiwanych wartości jest scentralizowana (data.ts)
- Wyraźny podział odpowiedzialności między plikami

### 2. Lepsza organizacja kodu

- Wszystko związane z daną funkcjonalnością znajduje się razem
- Łatwe znajdowanie i aktualizacja powiązanych elementów
- Zmniejszona potrzeba przeskakiwania między różnymi plikami

### 3. Skalowalność projektu

- Dodawanie nowych funkcjonalności nie wpływa na istniejące
- Łatwe rozszerzanie testu o nowe przypadki
- Możliwość równoległej pracy wielu osób nad różnymi funkcjonalnościami

### 4. Czytelniejsze testy

- Testy skupione na weryfikacji zachowania, nie na szczegółach implementacji
- Jasna struktura Arrange-Act-Assert
- Czytelne nazwy metod i zmiennych odzwierciedlające intencje

## Wnioski

Hybrydowe podejście łączące Page Object Model z architekturą Vertical Slice oferuje najlepsze z obu światów: abstrakcję interakcji z UI oraz organizację kodu według funkcjonalności. Dodatkowo wzorzec Early Return poprawia czytelność i zmniejsza złożoność kodu.

Taka architektura znacząco usprawnia proces tworzenia i utrzymania testów automatycznych, szczególnie w większych projektach, gdzie skalowalność i organizacja kodu są kluczowe. W przypadku aplikacji MAF, struktura testów odzwierciedla strukturę aplikacji, co czyni ją intuicyjną i łatwą do zrozumienia dla całego zespołu.

