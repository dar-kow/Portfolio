# Testowanie komponentów React z Testing Library vs Playwright - co wybrać i kiedy?

## Wprowadzenie

Testowanie front-endu, a w szczególności aplikacji zbudowanych w React, stało się jednym z kluczowych elementów procesu wytwarzania oprogramowania. Dwie popularne biblioteki testowe - React Testing Library oraz Playwright - oferują różne podejścia do weryfikacji poprawności działania interfejsu użytkownika. W tym artykule przeprowadzimy dogłębną analizę obu rozwiązań, wskazując ich mocne i słabe strony oraz scenariusze, w których sprawdzają się najlepiej.

## Spis treści:

1. [Charakterystyka narzędzi](#charakterystyka-narzędzi)
2. [Filozofia testowania](#filozofia-testowania)
3. [Konfiguracja środowiska](#konfiguracja-środowiska)
4. [Podstawowe przypadki testowe](#podstawowe-przypadki-testowe)
5. [Testowanie interakcji użytkownika](#testowanie-interakcji-użytkownika)
6. [Testowanie asynchroniczne](#testowanie-asynchroniczne)
7. [Mockowanie i izolacja testów](#mockowanie-i-izolacja-testów)
8. [Debugowanie testów](#debugowanie-testów)
9. [Wydajność i skalowalność](#wydajność-i-skalowalność)
10. [Integracja z CI/CD](#integracja-z-cicd)
11. [Porównanie na podstawie realnych scenariuszy](#porównanie-na-podstawie-realnych-scenariuszy)
12. [Podsumowanie i rekomendacje](#podsumowanie-i-rekomendacje)

## Charakterystyka narzędzi

### React Testing Library

React Testing Library (RTL) jest częścią większej rodziny bibliotek Testing Library, zaprojektowanych do testowania komponentów UI w sposób, który odzwierciedla rzeczywiste doświadczenia użytkownika. RTL kładzie nacisk na testowanie tego, co użytkownik widzi i z czym wchodzi w interakcję, zamiast koncentrować się na wewnętrznej implementacji komponentów.

```javascript
// Przykład podstawowego testu z React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('inkrementacja licznika po kliknięciu', () => {
  render(<Counter />);
  
  // Znajdujemy elementy na podstawie tekstu/roli
  const counter = screen.getByText(/licznik: 0/i);
  const incrementButton = screen.getByRole('button', { name: /zwiększ/i });
  
  // Symulujemy kliknięcie
  fireEvent.click(incrementButton);
  
  // Sprawdzamy czy stan się zmienił
  expect(screen.getByText(/licznik: 1/i)).toBeInTheDocument();
});
```

### Playwright

Playwright to framework do automatyzacji przeglądarek, który umożliwia testowanie end-to-end (E2E) aplikacji webowych w wielu przeglądarkach (Chromium, Firefox, WebKit). Chociaż Playwright jest głównie narzędziem do testów E2E, można go również wykorzystać do testowania komponentów React z użyciem `@playwright/experimental-ct-react`.

```javascript
// Przykład podstawowego testu z Playwright dla komponentu
import { test, expect } from '@playwright/experimental-ct-react';
import Counter from './Counter';

test('inkrementacja licznika po kliknięciu', async ({ mount }) => {
  // Renderujemy komponent
  const component = await mount(<Counter />);
  
  // Sprawdzamy początkowy stan
  await expect(component.getByText(/licznik: 0/i)).toBeVisible();
  
  // Klikamy przycisk
  await component.getByRole('button', { name: /zwiększ/i }).click();
  
  // Sprawdzamy czy stan się zmienił
  await expect(component.getByText(/licznik: 1/i)).toBeVisible();
});
```

## Filozofia testowania

| Aspekt | React Testing Library | Playwright |
|--------|------------------------|------------|
| Poziom testowania | Głównie testy jednostkowe i integracyjne | Głównie testy E2E, z możliwością testowania komponentów |
| Podejście | "Testing Library Way": testuj zachowanie, nie implementację | "Browser First": testuj jak prawdziwa przeglądarka |
| Selektory | Preferuje dostępne atrybuty (role, etykiety, tekst) | Oferuje wiele strategii wyboru elementów (CSS, XPath, tekst) |
| Izolacja | Testuje komponenty w izolacji lub płytkie integracje | Testuje całe aplikacje lub komponenty w kontekście przeglądarki |
| Focus | Na zachowaniu dostępnym dla użytkownika | Na pełnej funkcjonalności dostępnej w przeglądarce |

## Konfiguracja środowiska

### Konfiguracja React Testing Library

```javascript
// package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

