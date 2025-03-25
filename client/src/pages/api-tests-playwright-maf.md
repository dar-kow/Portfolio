# Testy backendu w aplikacji MAF - podejście oparte o Playwright

## Wprowadzenie

Testowanie API jest kluczowym elementem zapewnienia jakości w nowoczesnych aplikacjach webowych. W projekcie MAF (Moja Aplikacja Faktur) postawiliśmy na kompleksowe podejście do testów backendu, wykorzystując Playwright jako narzędzie testowe. W tym artykule omówię implementację testów API, przedstawię strukturę projektu testowego oraz pokażę konkretne przykłady testów z różnymi poziomami złożoności.

## Architektura testów

Testy backendu w MAF zostały zaprojektowane z myślą o modularności, możliwości ponownego użycia kodu oraz przejrzystości. Struktura projektu odzwierciedla logiczny podział na domeny biznesowe (faktury, kontrahenci) oraz wydzielone komponenty wspólne.

```
maf-api-tests/
├── common/
│   ├── api-base.ts         # Klasa bazowa dla wszystkich klas akcji API
│   └── types.ts            # Typy i enumy współdzielone między modułami
├── invoices/
│   ├── actions.ts          # Akcje API dla faktur
│   ├── data.ts             # Generatory danych testowych
│   ├── test.ts             # Podstawowe testy CRUD
│   └── complex.test.ts     # Złożone scenariusze testowe
└── contractors/
    ├── actions.ts          # Akcje API dla kontrahentów
    ├── data.ts             # Generatory danych testowych
    └── test.ts             # Testy CRUD
```

Ten podział pozwala na łatwe zarządzanie testami, utrzymanie wysokiej czytelności kodu oraz możliwość szybkiego rozszerzania zestawu testowego o nowe funkcjonalności.

## Podejście warstwowe

Kluczowym elementem naszej architektury testowej jest podział na trzy warstwy:

1. **Klasa bazowa** - zapewnia wspólne funkcjonalności dla wszystkich klas akcji
2. **Klasy akcji** - implementują metody do interakcji z konkretnym API
3. **Generatory danych** - dostarczają dane testowe
4. **Testy** - wykorzystują powyższe elementy do pisania scenariuszy testowych

### 1. Klasa bazowa (ApiBase)

Klasa `ApiBase` stanowi fundament wszystkich innych klas akcji, zapewniając obsługę odpowiedzi HTTP i formatowanie wyników.

```typescript
export class ApiBase {
    protected readonly request: APIRequestContext;
    protected readonly baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    protected async handleResponse(response: any) {
        const status = response.status();
        let responseData;

        try {
            if (status >= 200 && status < 300) {
                if (status === 204) {
                    responseData = null;
                } else {
                    responseData = await response.json();
                }
            } else {
                const errorText = await response.text();
                console.error(`API Error (${status}):`, errorText);
                responseData = {
                    error: true,
                    statusCode: status,
                    message: errorText.substring(0, 500)
                };
            }
        } catch (error) {
            const textContent = await response.text();
            console.error('Failed to parse response:', textContent);
            responseData = {
                error: true,
                message: `Failed to parse JSON: ${textContent.substring(0, 200)}...`,
                parseError: error.message
            };
        }

        return {
            status,
            data: responseData
        };
    }
}
```

### 2. Klasy akcji

Klasy akcji, jak `InvoiceActions` czy `ContractorActions`, dziedziczą po `ApiBase` i implementują metody do wykonywania konkretnych operacji na API.

```typescript
export class InvoiceActions extends ApiBase {
    // ... inne metody
    
    async createInvoice(contractorId: number, invoiceData?: Invoice) {
        let data: Invoice;

        const lastNumberResult = await this.getLastInvoiceNumber();
        let nextNumber = "FV/1/" + new Date().getFullYear();

        if (lastNumberResult.status === 200 && lastNumberResult.data) {
            // Logika generowania kolejnego numeru faktury
            const parts = lastNumberResult.data.split('/');
            if (parts.length === 3) {
                const prefix = parts[0];
                const number = parseInt(parts[1], 10);
                const year = parts[2];
                nextNumber = `${prefix}/${number + 1}/${year}`;
            }
        }

        if (invoiceData) {
            data = { ...invoiceData };
            data.number = nextNumber;
        } else {
            data = InvoiceData.generateRandomInvoice(contractorId);
            data.number = nextNumber;
            data = InvoiceData.calculateInvoiceTotals(data);
        }

        (data as any).createdAt = new Date().toISOString();

        const response = await this.request.post(`${this.baseUrl}/api/Invoices`, {
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await this.handleResponse(response);
        return {
            ...result,
            requestData: data
        };
    }
}
```

### 3. Generatory danych testowych

Do tworzenia realistycznych danych testowych wykorzystujemy bibliotekę `faker.js`, która pozwala na generowanie losowych, ale sensownych wartości dla naszych encji.

```typescript
export class InvoiceData {
    static generateRandomInvoice(contractorId: number): Invoice {
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        return {
            number: `FV/${faker.number.int({ min: 1, max: 9999 })}/${new Date().getFullYear()}`,
            issueDate: issueDate.toISOString(),
            dueDate: dueDate.toISOString(),
            totalAmount: 0,
            paymentStatus: this.getRandomPaymentStatus(),
            paidAmount: 0,
            description: faker.commerce.productDescription(),
            contractorId: contractorId,
            paymentMethod: this.getRandomPaymentMethod(),
            invoiceItems: this.generateRandomInvoiceItems(faker.number.int({ min: 1, max: 5 }))
        };
    }

    static calculateInvoiceTotals(invoice: Invoice): Invoice {
        // Logika kalkulacji sum
        let totalNet = 0;
        let totalVat = 0;

        for (const item of invoice.invoiceItems) {
            const itemNet = item.quantity * item.netPrice;
            let vatRateValue = 0;

            switch (item.vatRate) {
                case VatRate.Zero: vatRateValue = 0; break;
                case VatRate.Three: vatRateValue = 3; break;
                case VatRate.Five: vatRateValue = 5; break;
                case VatRate.Eight: vatRateValue = 8; break;
                case VatRate.TwentyThree: vatRateValue = 23; break;
            }

            const itemVat = itemNet * (vatRateValue / 100);
            totalNet += itemNet;
            totalVat += itemVat;
        }

        const totalGross = totalNet + totalVat;
        invoice.totalAmount = parseFloat(totalGross.toFixed(2));

        // Logika obsługi płatności
        if (invoice.paymentStatus === PaymentStatus.Paid) {
            invoice.paidAmount = invoice.totalAmount;
        } else if (invoice.paymentStatus === PaymentStatus.PartiallyPaid) {
            invoice.paidAmount = parseFloat((invoice.totalAmount * faker.number.float({ min: 0.1, max: 0.9, fractionDigits: 2 })).toFixed(2));
        } else {
            invoice.paidAmount = 0;
        }

        return invoice;
    }
    
    // ... inne metody pomocnicze
}
```

## Przykłady testów

### Testy CRUD

Podstawowe testy CRUD (Create, Read, Update, Delete) weryfikują, czy podstawowe operacje na encjach działają poprawnie:

```typescript
test('should create a new invoice', async ({ request }) => {
    const api = new InvoiceActions(request, API_BASE_URL);
    const result = await api.createInvoice(contractorId);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data.number).toBe(result.requestData.number);
    expect(result.data.contractorId).toBe(contractorId);
});

test('should get an invoice by ID', async ({ request }) => {
    const api = new InvoiceActions(request, API_BASE_URL);

    const createResult = await api.createInvoice(contractorId);
    expect(createResult.status).toBe(201);

    const invoiceId = createResult.data.id;
    const getResult = await api.getInvoiceById(invoiceId);

    expect(getResult.status).toBe(200);
    expect(getResult.data).toHaveProperty('id', invoiceId);
    expect(getResult.data).toHaveProperty('invoiceItems');
    expect(Array.isArray(getResult.data.invoiceItems)).toBeTruthy();
});

test('should update an invoice', async ({ request }) => {
    const api = new InvoiceActions(request, API_BASE_URL);

    const createResult = await api.createInvoice(contractorId);
    expect(createResult.status).toBe(201);

    const invoiceId = createResult.data.id;
    const originalInvoice = createResult.data;

    const updatedInvoice = {
        ...originalInvoice,
        description: 'Updated description',
        paymentStatus: PaymentStatus.Paid,
        paidAmount: originalInvoice.totalAmount
    };

    const updateResult = await api.updateInvoice(invoiceId, updatedInvoice);
    expect(updateResult.status).toBe(204);

    const getResult = await api.getInvoiceById(invoiceId);
    expect(getResult.status).toBe(200);
    expect(getResult.data.description).toBe(updatedInvoice.description);
    expect(getResult.data.paymentStatus).toBe(PaymentStatus.Paid);
    expect(getResult.data.paidAmount).toBe(updatedInvoice.paidAmount);
});
```

### Testy złożonych scenariuszy

W aplikacji MAF testujemy także bardziej złożone scenariusze biznesowe, które odzwierciedlają realne przypadki użycia.

```typescript
test('should handle invoice payment status changes', async ({ request }) => {
    const invoiceApi = new InvoiceActions(request, API_BASE_URL);
    const contractorApi = new ContractorActions(request, API_BASE_URL);

    const createContractorResult = await contractorApi.createContractor();
    const contractorId = createContractorResult.data.id;

    const invoiceData = InvoiceData.generateRandomInvoice(contractorId);
    invoiceData.paymentStatus = PaymentStatus.Unpaid;
    invoiceData.paidAmount = 0;

    // 1. Tworzenie faktury nieopłaconej
    const createResult = await invoiceApi.createInvoice(contractorId, invoiceData);
    expect(createResult.status).toBe(201);

    const invoiceId = createResult.data.id;

    // 2. Częściowa płatność
    const partialInvoice = {
        ...createResult.data,
        paymentStatus: PaymentStatus.PartiallyPaid,
        paidAmount: createResult.data.totalAmount / 2
    };

    const partialResult = await invoiceApi.updateInvoice(invoiceId, partialInvoice);
    expect(partialResult.status).toBe(204);

    const getPartialResult = await invoiceApi.getInvoiceById(invoiceId);
    expect(getPartialResult.data.paymentStatus).toBe(PaymentStatus.PartiallyPaid);

    // 3. Pełna płatność
    const paidInvoice = {
        ...getPartialResult.data,
        paymentStatus: PaymentStatus.Paid,
        paidAmount: getPartialResult.data.totalAmount
    };

    const paidResult = await invoiceApi.updateInvoice(invoiceId, paidInvoice);
    expect(paidResult.status).toBe(204);

    const getPaidResult = await invoiceApi.getInvoiceById(invoiceId);
    expect(getPaidResult.data.paymentStatus).toBe(PaymentStatus.Paid);
    expect(getPaidResult.data.paidAmount).toBe(getPaidResult.data.totalAmount);
});
```

### Testy masowego zasilania danymi

W projekcie MAF zaimplementowaliśmy także testy, które służą do generowania większej liczby danych testowych, co jest przydatne zarówno podczas rozwoju, jak i demonstracji aplikacji:

```typescript
test('Mass create invoices for database population', async ({ request }) => {
    const api = new InvoiceActions(request, API_BASE_URL);
    const contractorApi = new ContractorActions(request, API_BASE_URL);

    let contractorIds: number[] = [];
    const getContractorsResult = await contractorApi.getAllContractors();

    if (getContractorsResult.status === 200 && Array.isArray(getContractorsResult.data)) {
        contractorIds = getContractorsResult.data.map(c => c.id);
    }

    if (contractorIds.length < 5) {
        const newContractors = await contractorApi.createMultipleContractors(10);
        contractorIds = [...contractorIds, ...newContractors.map(c => c.id).filter((id): id is number => id !== undefined)];
    }

    const createdInvoices = await api.createMultipleInvoices(contractorIds, MASS_DATA_COUNT);

    expect(createdInvoices.length).toBe(MASS_DATA_COUNT);
    for (const invoice of createdInvoices) {
        expect(invoice).toHaveProperty('id');
    }
});
```

## Dlaczego Playwright do testów API?

Chociaż Playwright jest znany głównie jako narzędzie do testowania interfejsu użytkownika, świetnie sprawdza się również w testowaniu API:

1. **Zintegrowany klient HTTP** - pozwala na łatwe wykonywanie zapytań REST
2. **Spójne środowisko testowe** - możemy korzystać z tego samego narzędzia do testów front-end i back-end
3. **Doskonała obsługa asynchroniczności** - co jest ważne przy testowaniu API
4. **Bogaty zestaw asercji** - poprzez integrację z expect
5. **Równoległe wykonywanie testów** - dla szybszego uruchamiania zestawu testowego

## Model typów

W naszych testach wykorzystujemy silne typowanie TypeScript, co zapewnia spójność i pomaga wykryć potencjalne problemy już na etapie kompilacji:

```typescript
export enum PaymentStatus {
    Paid = 'Paid',
    PartiallyPaid = 'PartiallyPaid',
    Unpaid = 'Unpaid',
    Overdue = 'Overdue'
}

export interface Invoice {
    id?: number;
    createdAt?: string;
    number: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paidAmount: number;
    description: string;
    contractorId: number;
    paymentMethod: PaymentMethod;
    invoiceItems: InvoiceItem[];
}
```

## Wnioski

Podejście do testów API w projekcie MAF zapewnia:

1. **Modularność** - każda domena biznesowa ma swój zestaw testów
2. **Możliwość ponownego użycia** - klasy akcji i generatory danych są współdzielone między testami
3. **Czytelność** - dzięki jasnej strukturze i separacji odpowiedzialności
4. **Kompletność** - testy pokrywają zarówno podstawowe operacje CRUD, jak i złożone scenariusze biznesowe
5. **Skalowalność** - łatwo możemy dodawać nowe testy i rozszerzać istniejące

Taka organizacja testów pozwala na skuteczne wykrywanie regresji, dokumentowanie oczekiwanego zachowania API oraz zapewnienie, że wprowadzane zmiany nie naruszają istniejącej funkcjonalności.

Testy API stanowią jedną z wielu warstw zapewnienia jakości w projekcie MAF, uzupełniając testy jednostkowe, integracyjne i end-to-end, co wspólnie tworzy kompletną strategię testowania aplikacji.

---
