# Backend Testing in MAF Application - Playwright-Based Approach

## Introduction

API testing is a key element of quality assurance in modern web applications. In the MAF project (My Invoice Application), we adopted a comprehensive approach to backend testing using Playwright as the testing tool. In this article, I will discuss the implementation of API tests, present the test project structure, and show specific examples of tests with varying levels of complexity.

## Test Architecture

Backend tests in MAF were designed with modularity, code reusability, and clarity in mind. The project structure reflects a logical division into business domains (invoices, contractors) and separate shared components.

```
maf-api-tests/
├── common/
│   ├── api-base.ts         # Base class for all API action classes
│   └── types.ts            # Types and enums shared between modules
├── invoices/
│   ├── actions.ts          # API actions for invoices
│   ├── data.ts             # Test data generators
│   ├── test.ts             # Basic CRUD tests
│   └── complex.test.ts     # Complex test scenarios
└── contractors/
    ├── actions.ts          # API actions for contractors
    ├── data.ts             # Test data generators
    └── test.ts             # CRUD tests
```

This division allows for easy test management, high code readability, and the ability to quickly extend the test suite with new functionality.

## Layered Approach

A key element of our test architecture is the division into four layers:

1. **Base Class** - provides common functionalities for all action classes
2. **Action Classes** - implement methods for interacting with specific APIs
3. **Data Generators** - provide test data
4. **Tests** - use the above elements to write test scenarios

### 1. Base Class (ApiBase)

The `ApiBase` class serves as the foundation for all other action classes, providing HTTP response handling and result formatting.

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

### 2. Action Classes

Action classes such as `InvoiceActions` or `ContractorActions` inherit from `ApiBase` and implement methods for performing specific operations on the API.

```typescript
export class InvoiceActions extends ApiBase {
    // ... other methods
    
    async createInvoice(contractorId: number, invoiceData?: Invoice) {
        let data: Invoice;

        const lastNumberResult = await this.getLastInvoiceNumber();
        let nextNumber = "FV/1/" + new Date().getFullYear();

        if (lastNumberResult.status === 200 && lastNumberResult.data) {
            // Logic for generating the next invoice number
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

### 3. Test Data Generators

To create realistic test data, we use the `faker.js` library, which allows for generating random but meaningful values for our entities.

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
        // Calculation logic
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

        // Payment handling logic
        if (invoice.paymentStatus === PaymentStatus.Paid) {
            invoice.paidAmount = invoice.totalAmount;
        } else if (invoice.paymentStatus === PaymentStatus.PartiallyPaid) {
            invoice.paidAmount = parseFloat((invoice.totalAmount * faker.number.float({ min: 0.1, max: 0.9, fractionDigits: 2 })).toFixed(2));
        } else {
            invoice.paidAmount = 0;
        }

        return invoice;
    }
    
    // ... other helper methods
}
```

## Test Examples

### CRUD Tests

Basic CRUD (Create, Read, Update, Delete) tests verify that basic entity operations work correctly:

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

### Complex Scenario Tests

In the MAF application, we also test more complex business scenarios that reflect real use cases.

```typescript
test('should handle invoice payment status changes', async ({ request }) => {
    const invoiceApi = new InvoiceActions(request, API_BASE_URL);
    const contractorApi = new ContractorActions(request, API_BASE_URL);

    const createContractorResult = await contractorApi.createContractor();
    const contractorId = createContractorResult.data.id;

    const invoiceData = InvoiceData.generateRandomInvoice(contractorId);
    invoiceData.paymentStatus = PaymentStatus.Unpaid;
    invoiceData.paidAmount = 0;

    // 1. Creating an unpaid invoice
    const createResult = await invoiceApi.createInvoice(contractorId, invoiceData);
    expect(createResult.status).toBe(201);

    const invoiceId = createResult.data.id;

    // 2. Partial payment
    const partialInvoice = {
        ...createResult.data,
        paymentStatus: PaymentStatus.PartiallyPaid,
        paidAmount: createResult.data.totalAmount / 2
    };

    const partialResult = await invoiceApi.updateInvoice(invoiceId, partialInvoice);
    expect(partialResult.status).toBe(204);

    const getPartialResult = await invoiceApi.getInvoiceById(invoiceId);
    expect(getPartialResult.data.paymentStatus).toBe(PaymentStatus.PartiallyPaid);

    // 3. Full payment
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

### Mass Data Loading Tests

In the MAF project, we've also implemented tests that serve to generate a larger number of test data, which is useful during both development and application demonstrations:

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

## Why Playwright for API Tests?

Although Playwright is primarily known as a UI testing tool, it also excels in API testing:

1. **Integrated HTTP client** - allows for easy execution of REST requests
2. **Consistent test environment** - we can use the same tool for front-end and back-end tests
3. **Excellent asynchronicity handling** - which is important when testing APIs
4. **Rich assertion set** - through integration with expect
5. **Parallel test execution** - for faster test suite runs

## Type Model

In our tests, we use strong TypeScript typing, which ensures consistency and helps detect potential issues at the compilation stage:

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

## Conclusions

The approach to API testing in the MAF project provides:

1. **Modularity** - each business domain has its own set of tests
2. **Reusability** - action classes and data generators are shared between tests
3. **Readability** - thanks to a clear structure and separation of responsibilities
4. **Completeness** - tests cover both basic CRUD operations and complex business scenarios
5. **Scalability** - we can easily add new tests and extend existing ones

This organization of tests allows for effective regression detection, documentation of expected API behavior, and ensuring that introduced changes do not violate existing functionality.

API tests form one of many layers of quality assurance in the MAF project, complementing unit, integration, and end-to-end tests, collectively creating a complete application testing strategy.

---
