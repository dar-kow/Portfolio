### Istotnym aspektem rozwoju oprogramowania jest właściwe raportowaniu błędów 

**[ECOMMERCE] Błąd logiczny przy anulowaniu zamówienia: wyjątek przy próbie zwrotu całkowitej kwoty ("Wartość refundacji nie może przekraczać kwoty zamówienia")**

Podczas wykonywania procedury anulowania zamówienia z opcją "Zwróć całość", w logach systemu pojawia się wyjątek, który wskazuje na próbę zwiększenia kwoty refundacji powyżej pierwotnej wartości zamówienia. Pomimo tego, operacja w interfejsie użytkownika kończy się poprawnie i żaden komunikat błędu nie jest prezentowany klientowi.

**Kroki do odtworzenia:**
1. Wejdź do sekcji *Zamówienia*
2. Wykonaj anulowanie z opcją "Zwróć całość".
3. Obserwuj zachowanie aplikacji (brak błędów w interfejsie) oraz logi systemowe (wyjątek).

**Oczekiwane zachowanie:**
* System powinien odpowiednio obsługiwać logikę refundacji kwoty zamówienia.
* Wartość refundacji nie powinna przekraczać oryginalnej kwoty zamówienia.
* Operacja powinna zakończyć się bez wyjątku w logach systemu.

**Rzeczywiste zachowanie:**
* Operacja anulowania z opcją "Zwróć całość" kończy się poprawnie w interfejsie, ale w logach generowany jest wyjątek.

**Logi błędu:**
```
ERROR [RefundService] (transaction-handler-thread): Transaction error: Value cannot exceed original order amount
at com.onlineshop.payment.RefundProcessor.validateAmount(RefundProcessor.java:142)
at com.onlineshop.payment.RefundProcessor.processFullRefund(RefundProcessor.java:89)
```

---

**[INVENTORY] Status produktu w panelu Magazyn nie aktualizuje się po zatwierdzeniu dostawy**

W panelu **Magazyn** na liście produktów, po zatwierdzeniu dostawy, status produktu pozostaje jako "oczekiwanie na dostawę" i nie aktualizuje się na prawidłowy status. Problem ten utrudnia monitorowanie stanu magazynu i może wprowadzać w błąd pracowników magazynu.

**Kroki do odtworzenia:**
1. Przejdź do panelu **Magazyn**.
2. Zatwierdź dostawę produktu, co powinno zmienić status produktu.
3. Sprawdź listę produktów – zauważ, że status pozostaje ustawiony jako "oczekiwanie na dostawę", mimo że operacja przyjęcia dostawy została zakończona.

**Oczekiwane zachowanie:** 
Po zatwierdzeniu dostawy status produktu powinien zostać zaktualizowany do właściwego stanu (np. "dostępny", "w magazynie" lub inny odpowiedni status) w celu jednoznacznego wskazania aktualnej dostępności produktu.

**Rzeczywiste zachowanie:**
Status produktu nie zmienia się automatycznie po zatwierdzeniu dostawy, co powoduje niespójność między rzeczywistym stanem magazynowym a informacją wyświetlaną w systemie.

---

**[USER MANAGEMENT] "Menu kontekstowe w sekcji Użytkownicy nie znika po kliknięciu w opcję aktywacji konta"**

W widoku **Zarządzania użytkownikami** menu kontekstowe rozwija się poprawnie po kliknięciu prawym przyciskiem myszy na profilu użytkownika. Problem polega na tym, że po kliknięciu w opcję aktywacji konta (zarówno dla pojedynczego użytkownika, jak i przy próbie aktywacji wielu kont jednocześnie) menu kontekstowe nie zamyka się. Powinno ono automatycznie zniknąć, gdy użytkownik kliknie poza menu, lub gdy wybierze opcję z menu.

**Kroki do odtworzenia:**
1. Przejdź do sekcji **Użytkownicy** i otwórz widok **Zarządzanie użytkownikami**.
2. Kliknij prawym przyciskiem myszy na profilu użytkownika, aby wywołać menu kontekstowe – menu się rozwija.
3. Kliknij w opcję "Aktywuj konto" w menu kontekstowym.
4. Obserwuj, że menu kontekstowe nie znika, mimo że powinno zostać zamknięte.

**Oczekiwane zachowanie:** 
Menu kontekstowe powinno automatycznie znikać po wykonaniu następujących akcji:
* Kliknięciu w dowolną opcję menu (np. "Aktywuj konto", "Zablokuj dostęp").
* Kliknięciu poza menu.
* Naciśnięciu klawisza Escape.

**Rzeczywiste zachowanie:** 
Menu kontekstowe pozostaje widoczne i nie reaguje na kliknięcia w opcje menu ani na kliknięcia poza menu, co powoduje dezorientację administratora i wymaga dodatkowych działań w celu zamknięcia menu.


### Wiadomą rzeczą jest dołączenie do zgłoszenia zrzutu ekranu czy też krótkiego video / zawartości konsoli czy network z devtools.