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

### Konfiguracja Playwright dla testowania komponentów

```javascript
// package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@playwright/experimental-ct-react": "^1.40.0",
    "@playwright/test": "^1.40.0"
  }
}
```

```javascript
// playwright-ct.config.ts
import { defineConfig } from '@playwright/experimental-ct-react';
import { resolve } from 'path';

export default defineConfig({
  testDir: './tests',
  use: {
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
```

```typescript
// playwright/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testing with Playwright</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

## Podstawowe przypadki testowe

### React Testing Library

```javascript
// Testowanie renderowania komponentu
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('wyświetla dane użytkownika poprawnie', () => {
  const user = {
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    role: 'Developer'
  };
  
  render(<UserProfile user={user} />);
  
  expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
  expect(screen.getByText('jan@example.com')).toBeInTheDocument();
  expect(screen.getByText('Developer')).toBeInTheDocument();
});

// Testowanie warunkowego renderowania
test('wyświetla komunikat, gdy brak danych użytkownika', () => {
  render(<UserProfile />);
  
  expect(screen.getByText(/brak danych użytkownika/i)).toBeInTheDocument();
});
```

### Playwright

```javascript
// Testowanie renderowania komponentu
import { test, expect } from '@playwright/experimental-ct-react';
import UserProfile from './UserProfile';

test('wyświetla dane użytkownika poprawnie', async ({ mount }) => {
  const user = {
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    role: 'Developer'
  };
  
  const component = await mount(<UserProfile user={user} />);
  
  await expect(component.getByText('Jan Kowalski')).toBeVisible();
  await expect(component.getByText('jan@example.com')).toBeVisible();
  await expect(component.getByText('Developer')).toBeVisible();
});

// Testowanie warunkowego renderowania
test('wyświetla komunikat, gdy brak danych użytkownika', async ({ mount }) => {
  const component = await mount(<UserProfile />);
  
  await expect(component.getByText(/brak danych użytkownika/i)).toBeVisible();
});
```

## Testowanie interakcji użytkownika

### React Testing Library z user-event

```javascript
// Testowanie formularza logowania
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('wywołuje onSubmit z danymi logowania po naciśnięciu przycisku', async () => {
  const mockSubmit = jest.fn();
  render(<LoginForm onSubmit={mockSubmit} />);
  
  // Znajdź pola formularza
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/hasło/i);
  const submitButton = screen.getByRole('button', { name: /zaloguj/i });
  
  // Wpisz dane
  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password123');
  
  // Kliknij przycisk
  await userEvent.click(submitButton);
  
  // Sprawdź czy funkcja została wywołana z odpowiednimi argumentami
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### Playwright

```javascript
// Testowanie formularza logowania
import { test, expect } from '@playwright/experimental-ct-react';
import LoginForm from './LoginForm';

test('wywołuje onSubmit z danymi logowania po naciśnięciu przycisku', async ({ mount }) => {
  const onSubmitMock = { submit: ({ email, password }) => {} };
  const submitSpy = test.spyOn(onSubmitMock, 'submit');
  
  const component = await mount(
    <LoginForm onSubmit={onSubmitMock.submit} />
  );
  
  // Wpisz dane
  await component.getByLabel(/email/i).fill('test@example.com');
  await component.getByLabel(/hasło/i).fill('password123');
  
  // Kliknij przycisk
  await component.getByRole('button', { name: /zaloguj/i }).click();
  
  // Sprawdź czy funkcja została wywołana z odpowiednimi argumentami
  expect(submitSpy).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

## Testowanie asynchroniczne

### React Testing Library

```javascript
// Testowanie ładowania danych
import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
import { fetchUsers } from './api';

// Mockowanie modułu API
jest.mock('./api');

test('wyświetla listę użytkowników po załadowaniu', async () => {
  // Przygotowanie mocka
  fetchUsers.mockResolvedValueOnce([
    { id: 1, name: 'Jan Kowalski' },
    { id: 2, name: 'Anna Nowak' }
  ]);
  
  render(<UserList />);
  
  // Sprawdzenie czy loader jest wyświetlany
  expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();
  
  // Czekanie na dane
  await waitFor(() => {
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
    expect(screen.queryByText(/ładowanie/i)).not.toBeInTheDocument();
  });
});
```

### Playwright

```javascript
// Testowanie ładowania danych
import { test, expect } from '@playwright/experimental-ct-react';
import { MockedApiProvider } from './test-utils';
import UserList from './UserList';

test('wyświetla listę użytkowników po załadowaniu', async ({ mount }) => {
  // Dane do mocka
  const mockUsers = [
    { id: 1, name: 'Jan Kowalski' },
    { id: 2, name: 'Anna Nowak' }
  ];
  
  // Renderowanie komponentu z prowiderem mocka
  const component = await mount(
    <MockedApiProvider
      mocks={{
        fetchUsers: async () => mockUsers
      }}
    >
      <UserList />
    </MockedApiProvider>
  );
  
  // Sprawdzenie czy loader jest wyświetlany
  await expect(component.getByText(/ładowanie/i)).toBeVisible();
  
  // Czekanie na dane
  await expect(component.getByText('Jan Kowalski')).toBeVisible();
  await expect(component.getByText('Anna Nowak')).toBeVisible();
  
  // Sprawdzenie czy loader zniknął
  await expect(component.getByText(/ładowanie/i)).not.toBeVisible();
});
```

## Mockowanie i izolacja testów

### React Testing Library

```javascript
// Mockowanie kontekstu React
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

test('przełącza motyw', () => {
  const mockSetTheme = jest.fn();
  
  render(
    <ThemeContext.Provider value={{ theme: 'light', setTheme: mockSetTheme }}>
      <ThemeSwitcher />
    </ThemeContext.Provider>
  );
  
  // Kliknij przycisk przełącznika
  fireEvent.click(screen.getByRole('button', { name: /zmień motyw/i }));

  // Kliknij przycisk przełącznika
  fireEvent.click(screen.getByRole('button', { name: /zmień motyw/i }));
  
  // Sprawdź czy funkcja została wywołana z odpowiednim argumentem
  expect(mockSetTheme).toHaveBeenCalledWith('dark');
});

// Mockowanie modułów
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherWidget from './WeatherWidget';
import { getWeather } from './weatherService';

// Mockowanie modułu serwisu pogodowego
jest.mock('./weatherService');

test('wyświetla informacje o pogodzie po wyszukaniu miasta', async () => {
  // Ustawienie mocka
  getWeather.mockResolvedValueOnce({
    temperature: 21,
    conditions: 'Słonecznie',
    humidity: 45
  });
  
  render(<WeatherWidget />);
  
  // Wprowadzenie nazwy miasta
  await userEvent.type(screen.getByLabelText(/miasto/i), 'Warszawa');
  
  // Kliknięcie przycisku wyszukiwania
  await userEvent.click(screen.getByRole('button', { name: /sprawdź/i }));
  
  // Oczekiwanie na wyniki
  expect(await screen.findByText(/temperatura: 21°C/i)).toBeInTheDocument();
  expect(screen.getByText(/warunki: słonecznie/i)).toBeInTheDocument();
  expect(screen.getByText(/wilgotność: 45%/i)).toBeInTheDocument();
  
  // Sprawdzenie czy serwis został wywołany z odpowiednim argumentem
  expect(getWeather).toHaveBeenCalledWith('Warszawa');
});
```

### Playwright

```javascript
// Mockowanie kontekstu React
import { test, expect } from '@playwright/experimental-ct-react';
import { ThemeContext } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

test('przełącza motyw', async ({ mount }) => {
  const mockContextValue = {
    theme: 'light',
    setTheme: test.fn()
  };
  
  const component = await mount(
    <ThemeContext.Provider value={mockContextValue}>
      <ThemeSwitcher />
    </ThemeContext.Provider>
  );
  
  // Kliknij przycisk przełącznika
  await component.getByRole('button', { name: /zmień motyw/i }).click();
  
  // Sprawdź czy funkcja została wywołana z odpowiednim argumentem
  expect(mockContextValue.setTheme).toHaveBeenCalledWith('dark');
});

// Mockowanie żądań HTTP
import { test, expect } from '@playwright/experimental-ct-react';
import WeatherWidget from './WeatherWidget';

test('wyświetla informacje o pogodzie po wyszukaniu miasta', async ({ mount, page }) => {
  // Przygotowanie mocka dla API
  await page.route('**/api/weather?city=**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        temperature: 21,
        conditions: 'Słonecznie',
        humidity: 45
      })
    });
  });
  
  const component = await mount(<WeatherWidget />);
  
  // Wprowadzenie nazwy miasta
  await component.getByLabel(/miasto/i).fill('Warszawa');
  
  // Kliknięcie przycisku wyszukiwania
  await component.getByRole('button', { name: /sprawdź/i }).click();
  
  // Oczekiwanie na wyniki
  await expect(component.getByText(/temperatura: 21°C/i)).toBeVisible();
  await expect(component.getByText(/warunki: słonecznie/i)).toBeVisible();
  await expect(component.getByText(/wilgotność: 45%/i)).toBeVisible();
});
```

