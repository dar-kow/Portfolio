## Advanced Object-Oriented Approach to Automated Tests with TypeScript

## Table of contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Design Patterns](#design-patterns)
4. [Key Components](#key-components)
5. [Practical Application](#practical-application)
6. [Type and Interface Management](#type-and-interface-management)
7. [Advanced TypeScript Mechanisms](#advanced-typescript-mechanisms)
8. [Summary](#summary)

## Introduction

The presented solution demonstrates an advanced approach to creating automated tests using TypeScript and Playwright. The main goal was to create a reusable, easy-to-maintain, and extensible architecture for testing user interfaces, with special emphasis on data filtering operations in web applications.

The framework utilizes modern design practices such as:
- Object-oriented programming
- Strategy design pattern
- Abstraction and separation of concerns
- Interfaces and generic classes
- Static typing

## Solution Architecture

The solution is based on a multi-layered architecture that separates:

1. **Interfaces** - defining contracts for implementing classes
2. **Abstract classes** - providing base functionality
3. **Concrete implementations** - specific to tested views
4. **Action classes** - implementing UI interaction logic

Project structure diagram:

```
├── common/
│   ├── IElementComponents.ts      # Basic interfaces
│   ├── BaseElementComponents.ts   # Abstract class
│   └── elementActions.ts          # Main action class
├── module-specific/
│   ├── components.ts              # Concrete implementation for the module
│   └── test.ts                    # Tests for the given module
└── utils/
    └── index.ts                   # Helper tools
```

## Design Patterns

### 1. Strategy Pattern

The solution intensively uses the strategy pattern, where different algorithms (strategies) are encapsulated and can be exchanged. Implementation example:

```typescript
// Strategies for filling different types of fields
const fillStrategy: Record<ElementType, (key: T, val: RandomDataValue, elementId: string) => Promise<void>> = {
  [ElementType.NUMERIC_RANGE]: this.fillNumericRange.bind(this),
  [ElementType.MULTISELECT]: this.fillMultiselect.bind(this),
  [ElementType.TEXT]: this.fillText.bind(this),
  [ElementType.DATE_RANGE]: this.fillDateRange.bind(this),
  // Other strategies...
};

// Using the appropriate strategy
await fillStrategy[type](key, searchValue, elementId);
```

### 2. Template Method Pattern

The abstract class `BaseElementComponents` defines the algorithm skeleton, delegating the implementation of specific steps to subclasses:

```typescript
export abstract class BaseElementComponents<T extends string | number> implements IElementComponents<T> {
  // Common implementations
  public getDataFieldLocator(dataField: string): Locator {
    return this.page.locator(`[data-field="${dataField}"]`);
  }

  // Abstract methods to be implemented by subclasses
  abstract getFilterOptionByIndex(index: T): Locator;
  abstract getFilterTextInput(elementId: string, type?: ElementType): Locator;
  // Other methods...
}
```

### 3. Inversion of Control and Dependency Injection

Action classes accept dependencies through the constructor, which facilitates testing and increases flexibility:

```typescript
export class TestActions<T extends string | number> {
  constructor(
    private page: Page,
    private elements: IElementComponents<T>
  ) {}
  
  // Methods using injected dependencies
}
```

## Key Components

### IElementComponents - Base Interface

Defines the basic contract that all UI components must implement:

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

### BaseElementComponents - Abstract Class

Provides a partial implementation of the interface, leaving specific elements to be implemented by derived classes:

```typescript
export abstract class BaseElementComponents<T extends string | number> implements IElementComponents<T> {
  abstract mainButton: Locator;
  abstract closeIcons: Locator;
  abstract elementDefinitions: Record<T, ElementDefinition>;
  
  // Implementation of common methods
  
  protected constructor(protected page: Page) {}
  
  public getDataFieldLocator(dataField: string): Locator {
    return this.page.locator(`[data-field="${dataField}"]`);
  }
  
  // Remaining abstract methods...
}
```

### ModuleSpecificComponents - Concrete Implementation

Implements the abstract base class, providing module-specific selectors and functions:

```typescript
export class ModuleSpecificComponents extends BaseElementComponents<TestElementIndex> {
  constructor(page: Page) {
    super(page);
  }

  // Implementation of module-specific selectors
  public readonly elementDefinitions: Record<TestElementIndex, ElementDefinition> = {
    [TestElementIndex.IDENTIFIER]: {
      label: "Identifier",
      locator: () => this.identifierElement,
      dataField: "identifier",
      type: ElementType.TEXT,
    },
    // Other element definitions...
  };
  
  // Getters for element selectors
  get mainButton(): Locator {
    return this.page.locator(this.MAIN_BUTTON_SELECTOR);
  }
  
  // Remaining implementations consistent with the interface
}
```

### TestActions - Main Action Class

Central class implementing operations performed on interface elements:

```typescript
export class TestActions<T extends string | number> {
  constructor(
    private page: Page,
    private elements: IElementComponents<T>
  ) {}

  /**
   * Gets the number of defined elements.
   */
  public getElementCount(): number {
    return Object.keys(this.elements.elementDefinitions).length;
  }

  /**
   * Opens an element and optionally pins it.
   * @param key - Key of the element to open
   * @param pin - Whether the element should be pinned
   */
  public async openElement(key: T, pin: boolean = false): Promise<Locator> {
    // Implementation
  }
  
  /**
   * Extracts values from a data field based on element type.
   */
  public async extractAllDataValues(elementIndex: T, option: TestOption): Promise<string[]> {
    // Data extraction implementation
  }
  
  // Other action methods...
}
```

## Practical Application

Example of a test using the created architecture:

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

## Type and Interface Management

### Enumeration Types (Enums)

Define available options and states:

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

### Type Guards

Ensure safe operations on types:

```typescript
// Complex type
type RandomDataValue = string | { from: number; to: number } | { from: string; to: string } | null;

// Type guards
function isRangeValue(val: any): val is { from: string; to: string } {
  return typeof val === "object" && val !== null && "from" in val && "to" in val;
}

function isStringValue(val: any): val is string {
  return typeof val === "string";
}

// Example usage
if (isRangeValue(value)) {
  // TypeScript knows that value has from and to properties
  console.log(value.from, value.to);
} else if (isStringValue(value)) {
  // TypeScript knows that value is a string
  console.log(value.toUpperCase());
}
```

## Advanced TypeScript Mechanisms

### Generic Types

The solution intensively uses generic types to ensure flexibility and type safety:

```typescript
export class TestActions<T extends string | number> {
  // T is a generic parameter constrained to string or number
  // This allows using enums as indexes for objects
}
```

### Type Mapping and Records

Used to create object types with dynamic keys:

```typescript
// Dynamic type mapping
const rangeExtractors: { [key in ElementType]?: (values: string[], side: RangeOption) => RandomDataValue } = {
  [ElementType.NUMERIC_RANGE]: this.getNumericRangeValue.bind(this),
  [ElementType.DATE_RANGE]: this.getDateRangeValue.bind(this),
};

// Typical records
private labelFormatters: Record<ElementType, (label: string, value: RandomDataValue) => string> = {
  [ElementType.TEXT]: (label, value) => `${label}:Contains "${value}"`,
  [ElementType.NUMERIC_RANGE]: (label, value) => {
    // Implementation of formatting for a numeric range
  },
  // Other formatters...
};
```

### Destructuring and Spread

Used for readable object manipulation:

```typescript
// Destructuring
const { searchArea, applyButton } = await this.getElementLocators(elementId, type);

// Spread operator
const filteredTexts = Array.from(new Set([...existingTexts, ...additionalTexts]));
```

## Summary

The presented solution demonstrates advanced programming skills in:

1. **Object-oriented design** - proper application of inheritance, interfaces, and abstraction
2. **Typing** - effective use of TypeScript's type system to ensure type safety
3. **Design patterns** - implementation of recognized patterns to increase code flexibility and reusability
4. **Clean Code** - code structuring according to SOLID and DRY principles
5. **Testing** - tests that are readable, concise, and easy to maintain

This solution can be easily extended with new modules and element types while maintaining architectural consistency and high code quality.

---