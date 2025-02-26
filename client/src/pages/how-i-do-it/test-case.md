## Przypadki testowe - Moduł faktur (light version)

Te przypadki testowe obejmują najważniejsze scenariusze dla modułu faktur:

1. **TC-FAK-001** - Pomyślne utworzenie i zatwierdzenie faktury:
   - Testuje podstawowy "happy path" dla tworzenia faktury
   - Weryfikuje poprawność obliczeń kwot i podatków
   - Sprawdza przejścia stanów od Projektu do Zatwierdzonej faktury

2. **TC-FAK-002** - Walidacja niepoprawnych danych faktury:
   - Testuje mechanizmy walidacji danych
   - Weryfikuje, czy system prawidłowo wykrywa różne typy błędów
   - Sprawdza komunikaty o błędach

3. **TC-FAK-003** - Anulowanie wystawionej faktury:
   - Testuje proces anulowania faktury
   - Weryfikuje wymagane informacje (powód anulowania)
   - Sprawdza blokadę edycji anulowanej faktury
# 



## Szczegółowe przypadki testowe - Moduł faktur (solid version)

#### **TC_FAK_001.GivenUserCreatesNewInvoiceAndFillsAllRequiredFields_WhenUserValidatesAndApproves_ThenInvoiceIsSuccessfullyCreated**

**Tytuł:** Pomyślne utworzenie i zatwierdzenie nowej faktury.

**Opis**: Przypadek testowy obejmuje kompletny proces tworzenia nowej faktury z wypełnieniem wszystkich wymaganych pól oraz jej zatwierdzenie za pomocą interfejsu graficznego użytkownika.

| **Lp.** | **Akcja** | **Efekt** |
|:---:|---|---|
| **1** | Kliknij na ikonę faktury w bocznym menu. | Otwiera się sekcja *Faktury* |
| **2** | Kliknij w prawym górnym rogu aplikacji na przycisk *Nowa faktura* | Oczekuj pojawienia się *snackbar* informującego o sukcesie utworzenia faktury. System tworzy nową fakturę w stanie "Projekt". |
| **3** | W sekcji *Kontrahent* kliknij przycisk *Wybierz* | Otworzy się okno dialogowe z listą dostępnych kontrahentów. |
| **4** | Wybierz kontrahenta z listy (np. "Firma XYZ") | Dane kontrahenta zostaną wprowadzone do formularza faktury. |
| **5** | W sekcji *Dane faktury* ustaw datę wystawienia na dzień bieżący | Data wystawienia zostanie zaktualizowana. |
| **6** | Ustaw datę sprzedaży na dzień bieżący | Data sprzedaży zostanie zaktualizowana. |
| **7** | Ustaw termin płatności na 14 dni od daty wystawienia | Termin płatności zostanie zaktualizowany. |
| **8** | W sekcji *Metoda płatności* wybierz: *Przelew* | Metoda płatności zostanie ustawiona na "Przelew". |
| **9** | Kliknij przycisk *Dodaj pozycję* | Otworzy się okno dodawania pozycji faktury. |
| **10** | W oknie dodawania pozycji wybierz produkt "Produkt A" z listy | Produkt zostanie wybrany. |
| **11** | Ustaw ilość na wartość "2" | Ilość zostanie zaktualizowana. |
| **12** | Ustaw cenę jednostkową netto na "100,00 zł" | Cena zostanie zaktualizowana. |
| **13** | Wybierz stawkę VAT "23%" | Stawka VAT zostanie zaktualizowana. |
| **14** | Kliknij przycisk *Dodaj* | Pozycja zostanie dodana do faktury. System automatycznie obliczy wartości netto, VAT i brutto. |
| **15** | Kliknij przycisk *Weryfikuj* | System rozpocznie proces weryfikacji danych faktury. |
| **16** | Poczekaj na zakończenie weryfikacji | System zmieni stan faktury na "Zatwierdzona" i wyświetli stosowny komunikat. |
| **17** | Kliknij przycisk *Wystaw fakturę* | Faktura zostanie wystawiona (zmiana stanu na "Wystawiona") i otrzyma numer. |
| **18** | Kliknij przycisk *Pobierz PDF* | System wygeneruje plik PDF z fakturą. |

**Oczekiwany wynik**: Po wykonaniu wszystkich kroków zostanie utworzona, zatwierdzona i wystawiona faktura z poprawnie obliczonymi kwotami (netto: 200,00 zł, VAT: 46,00 zł, brutto: 246,00 zł). Faktura będzie dostępna do pobrania w formacie PDF.

---

#### **TC_FAK_002.GivenUserStartsEditingExistingInvoice_WhenInvalidDataIsEntered_ThenValidationErrorMessagesAreDisplayed**

**Tytuł:** Walidacja błędnych danych podczas edycji faktury.

**Opis**: Przypadek testowy weryfikuje mechanizmy walidacji podczas edycji istniejącej faktury, poprzez wprowadzenie niepoprawnych danych w różnych polach i sprawdzenie komunikatów o błędach.

| **Lp.** | **Akcja** | **Efekt** |
|:---:|---|---|
| **1** | Kliknij na ikonę faktury w bocznym menu. | Otwiera się sekcja *Faktury* |
| **2** | Z listy faktur wybierz fakturę w stanie "Projekt" | Otworzy się widok szczegółów faktury. |
| **3** | Kliknij przycisk *Edytuj* | Formularz faktury przejdzie w tryb edycji. |
| **4** | W sekcji *Kontrahent* kliknij przycisk *Wyczyść* | Dane kontrahenta zostaną usunięte. |
| **5** | W sekcji *Dane faktury* ustaw datę wystawienia na dzień bieżący | Data wystawienia zostanie zaktualizowana. |
| **6** | Ustaw datę sprzedaży na 40 dni przed datą wystawienia | Data sprzedaży zostanie zaktualizowana. |
| **7** | Ustaw termin płatności na dzień przed datą wystawienia | Termin płatności zostanie zaktualizowany. |
| **8** | Kliknij przycisk *Dodaj pozycję* | Otworzy się okno dodawania pozycji faktury. |
| **9** | W oknie dodawania pozycji wybierz produkt "Produkt B" z listy | Produkt zostanie wybrany. |
| **10** | Ustaw ilość na wartość "-2" (ujemna ilość) | Ilość zostanie wprowadzona. |
| **11** | Ustaw cenę jednostkową netto na "100,00 zł" | Cena zostanie zaktualizowana. |
| **12** | Wybierz stawkę VAT "23%" | Stawka VAT zostanie zaktualizowana. |
| **13** | Kliknij przycisk *Dodaj* | System wyświetli komunikat o błędzie: "Ilość musi być większa od zera". |
| **14** | Popraw ilość na "2" i kliknij przycisk *Dodaj* | Pozycja zostanie dodana do faktury. |
| **15** | Kliknij przycisk *Weryfikuj* | System rozpocznie proces weryfikacji danych faktury i wyświetli błędy: "Kontrahent jest wymagany", "Data sprzedaży nie może być wcześniejsza niż 30 dni od daty wystawienia", "Termin płatności nie może być wcześniejszy niż data wystawienia". |
| **16** | Popraw dane kontrahenta wybierając firmę z listy | Dane kontrahenta zostaną uzupełnione. |
| **17** | Popraw datę sprzedaży na dzień bieżący | Data sprzedaży zostanie zaktualizowana. |
| **18** | Popraw termin płatności na 14 dni od daty wystawienia | Termin płatności zostanie zaktualizowany. |
| **19** | Kliknij ponownie przycisk *Weryfikuj* | System przeprowadzi weryfikację i zmieni stan faktury na "Zatwierdzona". |

**Oczekiwany wynik**: System poprawnie zidentyfikuje wszystkie błędy w danych faktury i wyświetli odpowiednie komunikaty walidacyjne. Po poprawieniu błędów, faktura przejdzie pomyślnie proces weryfikacji i zostanie zatwierdzona.

---

#### **TC_FAK_003.GivenInvoiceIsInIssuedState_WhenUserSelectsCorrectionOption_ThenCorrectionInvoiceIsCreatedWithProperReference**

**Tytuł:** Tworzenie faktury korygującej.

**Opis**: Przypadek testowy obejmuje proces utworzenia faktury korygującej do istniejącej, wystawionej faktury, wraz z określeniem powodu korekty i powiązaniem z fakturą oryginalną.

| **Lp.** | **Akcja** | **Efekt** |
|:---:|---|---|
| **1** | Kliknij na ikonę faktury w bocznym menu. | Otwiera się sekcja *Faktury* |
| **2** | Z listy faktur wybierz fakturę w stanie "Wystawiona" | Otworzy się widok szczegółów faktury. |
| **3** | Kliknij przycisk *Utwórz korektę* | Otworzy się formularz tworzenia faktury korygującej z predefiniowanymi danymi z faktury oryginalnej. |
| **4** | W sekcji *Powód korekty* wpisz "Zmiana ilości towaru" | Powód korekty zostanie zapisany. |
| **5** | Zweryfikuj, że w formularzu wyświetla się numer faktury korygowanej | System powinien wyświetlać informację o numerze faktury oryginalnej. |
| **6** | W sekcji pozycji faktury, znajdź pozycję "Produkt A" | Pozycja zostanie wyświetlona z danymi z faktury oryginalnej. |
| **7** | Kliknij przycisk *Edytuj* przy pozycji "Produkt A" | Otworzy się okno edycji pozycji. |
| **8** | Zmień ilość z "2" na "1" | Ilość zostanie zaktualizowana. |
| **9** | Kliknij przycisk *Zapisz* | Pozycja zostanie zaktualizowana, a system automatycznie obliczy nowe wartości netto, VAT i brutto oraz różnicę w stosunku do faktury oryginalnej. |
| **10** | Zweryfikuj, że system wyświetla zarówno pierwotne wartości, jak i wartości po korekcie | System powinien pokazywać: Przed korektą (2 szt., 200,00 zł netto), Po korekcie (1 szt., 100,00 zł netto), Różnica (-1 szt., -100,00 zł netto). |
| **11** | Kliknij przycisk *Weryfikuj* | System rozpocznie proces weryfikacji danych faktury korygującej. |
| **12** | Poczekaj na zakończenie weryfikacji | System zmieni stan faktury korygującej na "Zatwierdzona" i wyświetli stosowny komunikat. |
| **13** | Kliknij przycisk *Wystaw fakturę korygującą* | Faktura korygująca zostanie wystawiona i otrzyma numer w formacie "KOREKTA/[numer oryginalnej faktury]". |
| **14** | Kliknij przycisk *Pobierz PDF* | System wygeneruje plik PDF z fakturą korygującą. |
| **15** | Wróć do listy faktur | Zostanie wyświetlona lista faktur. |
| **16** | Sprawdź, czy faktura oryginalna ma oznaczenie "Skorygowana" | Faktura oryginalna powinna być oznaczona jako "Skorygowana" z odnośnikiem do faktury korygującej. |

**Oczekiwany wynik**: Po wykonaniu wszystkich kroków zostanie utworzona i wystawiona faktura korygująca z poprawnym odniesieniem do faktury oryginalnej. Faktura korygująca będzie zawierać informacje o różnicach wartości przed i po korekcie. Faktura oryginalna zostanie oznaczona jako skorygowana.

## Korzyści wynikające z systematycznego podejścia do dokumentacji testowej

Zastosowanie szczegółowych przypadków testowych w formacie GIVEN-WHEN-THEN z numeracją i tabelarycznym przedstawieniem kroków przynosi szereg wymiernych korzyści dla całego zespołu deweloperskiego:

### Spójność danych i zrozumienia w zespole

1. **Jednolita interpretacja wymagań** - Precyzyjne przypadki testowe zapewniają, że wszyscy członkowie zespołu identycznie rozumieją sposób działania funkcjonalności. Eliminuje to rozbieżności interpretacyjne między developerami, testerami i analitykami biznesowymi.

2. **Spójny model mentalny** - Format GIVEN-WHEN-THEN tworzy wspólny język i model mentalny dla całego zespołu, co ułatwia komunikację i redukuje błędy wynikające z nieporozumień.

3. **Przejrzystość stanów i przejść między nimi** - Prezentacja diagramu stanów faktury oraz powiązanych przypadków testowych daje całościowy obraz cyklu życia dokumentu, co zapewnia spójne zrozumienie przepływu danych.

### Użyteczność pod kątem testów automatycznych

1. **Gotowa podstawa do automatyzacji** - Szczegółowe kroki testowe z precyzyjnie określonymi akcjami i oczekiwanymi rezultatami można bezpośrednio przełożyć na skrypty automatyzacyjne, oszczędzając czas na analizę i projektowanie testów.

2. **Łatwiejsza implementacja asercji** - Każdy "THEN" w strukturze GIVEN-WHEN-THEN może być bezpośrednio przetłumaczony na asercje w testach automatycznych, co zwiększa dokładność i kompletność weryfikacji.

3. **Ułatwione wykrywanie regresji** - Precyzyjne scenariusze testowe pozwalają na szybkie wykrycie regresji poprzez automatyczne wykonanie wszystkich zdefiniowanych kroków i weryfikację rezultatów.

4. **Utrzymywalność testów** - Gdy testy automatyczne są oparte na dobrze zdefiniowanych przypadkach testowych, zmiany w funkcjonalności można łatwiej śledzić i aktualizować zarówno dokumentację, jak i kod testów.

### Dokumentacja dla przyszłych członków zespołu

1. **Skrócenie czasu onboardingu** - Nowi członkowie zespołu mogą szybko zrozumieć działanie systemu poprzez analizę diagramów stanów i szczegółowych przypadków testowych, bez konieczności przekopywania się przez kod źródłowy.

2. **Źródło wiedzy domenowej** - Przypadki testowe stanowią nie tylko dokumentację techniczną, ale również zawierają cenne informacje o logice biznesowej i regułach domeny.

3. **Żywa dokumentacja** - Utrzymywane na bieżąco przypadki testowe stanowią aktualną dokumentację systemu, która ewoluuje wraz z produktem, w przeciwieństwie do tradycyjnej dokumentacji, która często staje się nieaktualna.

4. **Samodokumentujące się wymagania** - Format GIVEN-WHEN-THEN w połączeniu z krokami testowymi pozwala nowym członkom zespołu zrozumieć nie tylko JAK działa system, ale również DLACZEGO działa w określony sposób.

### Dodatkowe korzyści biznesowe

1. **Redukcja kosztów błędów** - Precyzyjne testy zmniejszają liczbę błędów przechodzących do produkcji, co bezpośrednio przekłada się na oszczędności finansowe i lepszą reputację produktu.

2. **Zwiększona transparentność dla interesariuszy** - Przypadki testowe w zrozumiałym formacie mogą być prezentowane również nietechnicznym interesariuszom, co zwiększa ich zaufanie do procesu wytwórczego.

3. **Przyspieszona walidacja wymagań** - Przypadki testowe w formacie GIVEN-WHEN-THEN mogą być weryfikowane przez biznes jeszcze przed implementacją, co pozwala na wczesne wykrycie nieścisłości w wymaganiach.

Przyjęcie takiego systematycznego podejścia do testów i dokumentacji tworzy pozytywny cykl, w którym każdy nowy test wzbogaca bazę wiedzy zespołu, usprawnia komunikację i podnosi jakość produktu końcowego.