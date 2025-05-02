# Benefits of Layered Architecture in E2E Tests: POM and Vertical Slice

Test architecture is crucial for maintainability and scalability of automated tests. Analyzing the presented MAF E2E testing project built with Playwright and TypeScript, we can observe a hybrid approach combining Page Object Model (POM) with Vertical Slice architecture. Let's examine this architecture and its advantages in detail.

[Repo - in progress](https://github.com/dar-kow/maf-e2e-pw)

## Hybrid Approach: POM + Vertical Slice

The MAF E2E project utilizes two popular architectural patterns:

### Page Object Model (POM)

POM is a classic design pattern in UI testing that:

- Encapsulates UI interactions in dedicated classes
- Separates test logic from UI implementation details
- Creates an abstraction over interface elements

### Vertical Slice Architecture

Instead of organizing code by technical layers (e.g., all selectors together, all actions together), the project organizes code by features:

- Each functionality (e.g., Sidebar, Navbar) has its own self-contained directory
- All components needed to test a given function are kept together
- Provides better cohesion and reduced coupling between modules

## Project Structure

```
tests/
├── sidebar/           # Vertical slice for Sidebar
│   ├── actions.ts     # UI interactions
│   ├── components.ts  # Element selectors
│   ├── data.ts        # Test data
│   └── test.ts        # Test specifications
├── navbar/            # Vertical slice for Navbar
    ├── actions.ts
    ├── components.ts
    ├── data.ts
    └── test.ts
```

## Role of Individual Files

### components.ts - Selector Centralization

The `components.ts` file contains all selectors needed to locate UI elements:

```typescript
export const SidebarComponents = {
    root: '[data-testid="sidebar-root"]',
    toggle: '[data-testid="sidebar-toggle"]',
    // ...other selectors
};
```

**Benefits**:
- Centralization of selectors in one place
- Easy updates in case of UI changes
- Clear naming of elements
- Possibility to reuse the same selectors in different tests

### data.ts - Test Data Isolation

The `data.ts` file stores all test data, expected values, and constants:

```typescript
export const SidebarData = {
    title: 'M-A-F',
    subtitle: 'Moja Aplikacja Faktur',
    menuItems: {
        dashboard: 'Dashboard',
        invoices: 'Faktury',
        contractors: 'Kontrahenci',
    },
    // ...other data
};
```

**Benefits**:
- Separation of data from test logic
- Easy modification of expected values
- Test consistency (same values used consistently)
- Easier adaptation of tests to different environments

### actions.ts - Interaction Methods Without Assertions

The `actions.ts` file contains methods for interacting with the application, without assertions:

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
    // ...other methods
}
```

**Benefits**:
- Abstraction of UI interactions
- Reusability of methods in different tests
- More maintainable code - UI changes require modifications in only one place
- More readable tests, focused on behavior rather than technical implementation

### test.ts - Tests With Assertions

The `test.ts` file contains the actual tests with assertions:

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

**Benefits**:
- Tests focused on specific behaviors
- Clear Arrange-Act-Assert structure
- Clear separation of test logic from implementation details
- Easier understanding of test intent

## Early Return Pattern

The project also uses the "Early Return" pattern instead of complex conditional structures:

```typescript
// Early return pattern
async isSidebarCollapsed() {
    const sidebar = await this.page.$(SidebarComponents.root);
    return await sidebar?.evaluate(el => el.classList.contains('sidebar-collapsed'));
}

// Instead of complex if/else structures
async toggleAction() {
    if (await this.someCondition()) {
        // do something
    } else {
        // do something else
    }
}
```

**Benefits**:
- Better code readability
- Reduced cyclomatic complexity
- Fewer levels of nesting
- Clear execution paths

## Key Benefits of This Approach

### 1. Increased Maintainability

- UI changes require updates in only one place (components.ts)
- Modification of expected values is centralized (data.ts)
- Clear separation of responsibilities between files

### 2. Better Code Organization

- Everything related to a given functionality is kept together
- Easy to find and update related elements
- Reduced need to jump between different files

### 3. Project Scalability

- Adding new functionalities doesn't affect existing ones
- Easy extension of tests with new cases
- Possibility for multiple people to work in parallel on different functionalities

### 4. More Readable Tests

- Tests focused on behavior verification, not implementation details
- Clear Arrange-Act-Assert structure
- Readable method and variable names reflecting intentions

## Conclusions

The hybrid approach combining Page Object Model with Vertical Slice architecture offers the best of both worlds: abstraction of UI interactions and organization of code by functionality. Additionally, the Early Return pattern improves readability and reduces code complexity.

Such architecture significantly enhances the process of creating and maintaining automated tests, especially in larger projects where scalability and code organization are key. In the case of the MAF application, the test structure mirrors the application structure, making it intuitive and easy to understand for the entire team.