# Refactoring Large Test Files:
## Facade Pattern and Delegation as a Way to Organize Chaos

When projects grow, test classes often transform into monolithic behemoths filled with repetitive code. In this article, we'll discuss a strategy for refactoring large test action files using the facade pattern and delegation to maintain order and scalability.

## State Before Refactoring: Anatomy of Chaos

Analyzing the provided code, we see a typical example of the problem - the ***SaleActions*** class in the ***old-actions.ts*** file counts over 1,500 lines of code. It's a classic "God Object" containing:

- Interface navigation methods
- Form filling methods
- Price and discount calculations
- Approval and verification actions
- Shopping cart manipulations
- Payment handling

The problems with this approach are obvious:
1. **Maintenance difficulty** - a single change requires understanding the entire class
2. **Conflict risk** - many developers working on the same file
3. **Debugging difficulty** - problems are hard to locate
4. **SOLID principles violation** - especially the Single Responsibility Principle
5. **Entry barrier** - new team members feel overwhelmed

## Architecture After Refactoring: Facade and Delegation

The refactoring introduces the facade pattern, preserving the existing interface of the ***SaleActions*** class while delegating specific operations to specialized classes:

```typescript
export class SaleActions {
  // Modules from the new structure
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
    // Initialization of all modules...
  }

  // Delegations to appropriate modules...
  async collectBasketData(): Promise<BasketItem[]> {
    return this.basketTableManager.collectBasketData();
  }

  async createNewSale(): Promise<void> {
    return this.processActions.createNewSale();
  }

  // Other delegations...
}
```

The code above shows the main ***SaleActions*** class, which now acts as a facade. Instead of implementing all methods, it delegates calls to specialized classes:

1. **BasketTableManager** - shopping cart table management
2. **ProcessActions** - sales and payment processes
3. **ItemActions** - item, price, and discount management
4. **CommonActions** - common UI and loading operations

## Advantages of the New Approach

### 1. Easier Maintenance and Development

Each class now has a clearly defined responsibility, making it easier to find and modify code. New functionalities can be added in appropriate modules without touching the entire system.

### 2. Better Code Organization

The modular structure makes it easier to understand the system:

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

### 3. Easier Testing

Smaller, specialized classes are easier to unit test. We can now test ***BasketDataExtractor*** functionality independently of the rest of the system.

### 4. SOLID Compliance

- **Single Responsibility** - each class has one responsibility
- **Open/Closed** - extending functionality without modifying existing code
- **Liskov Substitution** - interfaces allow implementation substitutions
- **Interface Segregation** - small, dedicated interfaces
- **Dependency Inversion** - dependencies through abstractions

### 5. Easier Onboarding of New Team Members

New developers can focus on understanding one module, instead of the entire system.

## Potential Disadvantages and Challenges

### 1. Structure Complexity

Introducing many classes and interfaces increases the structural complexity of the project. This may make it harder to understand data flow for people unfamiliar with the pattern.

### 2. Refactoring Costs

Transforming an existing system requires time and attention. There's a risk of introducing errors during code migration.

### 3. Potential Redundancy

Introducing delegation can lead to excessive intermediate layers:

```typescript
// Example of potential redundancy
async createNewSale(): Promise<void> {
  return this.processActions.createNewSale();
}
```

### 4. State Management

Distributed classes can make it difficult to manage shared state. It may be necessary to introduce synchronization mechanisms.

## Strategic Approach to Refactoring

### 1. Analyzing Existing Code

Before you start, analyze the existing code, identifying natural functionality clusters. In our case, we extracted table operations, item management, and sales processes.

### 2. Gradual Implementation

Instead of refactoring everything at once, it's better to work iteratively:

1. Extract one functionality group (e.g., table operations)
2. Build a new class and move code to it
3. Apply delegations in the main class
4. Run tests to make sure everything works correctly
5. Move to the next functionality group

### 3. Building on Interfaces

Use interfaces to define contracts between components:

```typescript
export interface TableActionExecutor {
  openRowMenu(rowIndex: string | number): Promise<void>;
  executeAction(actionId: string): Promise<void>;
  // other methods...
}

export class BasketActionExecutor implements TableActionExecutor {
  // implementation...
}
```

### 4. Maintaining Compatibility

It's essential to maintain the existing public interface of the main class so that tests don't require modification:

```typescript
// Before refactoring
await saleActions.clickChangePriceButton();

// After refactoring - same interface, different implementation
async clickChangePriceButton(): Promise<void> {
  return this.itemPriceActions.clickChangePriceButton();
}
```

## DRY vs YAGNI in the Context of Refactoring

During refactoring, we often encounter tension between DRY (Don't Repeat Yourself) and YAGNI (You Aren't Gonna Need It) principles:

**DRY**: Eliminating code duplication leads to creating abstractions, which can be seen in our ***BasketTableNavigator*** or ***BasketDataExtractor*** classes.

**YAGNI**: Excessive abstraction can lead to unnecessary complexity. Sometimes a simple method in one class is better than a complicated class hierarchy.

A reasonable approach is:
1. Eliminating obvious duplications
2. Creating abstractions only where they bring clear benefits
3. Delaying the creation of advanced abstractions until patterns become clear

## Practical Conclusions

1. **Start with a clear plan** - a refactoring map will help maintain the direction of changes

2. **Test continuously** - each change should be verified by tests

3. **Document changes** - well-written comments and documentation will make it easier to understand the new structure

4. **Consider using tools** - automation can help in safe refactoring

5. **Communicate changes to the team** - everyone should understand the new architecture

## Summary

The facade pattern and delegation are powerful tools in refactoring large, monolithic test classes. While this process requires careful planning and execution, the benefits of easier maintenance, testing, and code extension are worth the effort.

Let's remember, however, that refactoring is not an end in itself, but a means to create better, more maintainable code. The key is finding a balance between ideal abstraction and practical usefulness, always keeping in mind the needs of the team and project.