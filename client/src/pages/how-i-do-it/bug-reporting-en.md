### An important aspect of software development is proper bug reporting

**[ECOMMERCE] Logical error when canceling an order: exception when attempting to refund the total amount ("Refund value cannot exceed order amount")**

When performing the order cancellation procedure with the "Refund All" option, an exception appears in the system logs indicating an attempt to increase the refund amount above the original order value. Despite this, the operation in the user interface completes successfully and no error message is presented to the customer.

**Steps to reproduce:**
1. Go to the *Orders* section
2. Perform cancellation with the "Refund All" option.
3. Observe the application behavior (no errors in the interface) and system logs (exception).

**Expected behavior:**
* The system should properly handle the order refund logic.
* The refund value should not exceed the original order amount.
* The operation should complete without any exceptions in the system logs.

**Actual behavior:**
* The cancellation operation with the "Refund All" option completes successfully in the interface, but an exception is generated in the logs.

**Error logs:**
```typescript
ERROR [RefundService] (transaction-handler-thread): Transaction error: Value cannot exceed original order amount 
at com.onlineshop.payment.RefundProcessor.validateAmount(RefundProcessor.java:142) 
at com.onlineshop.payment.RefundProcessor.processFullRefund(RefundProcessor.java:89)
```

**[INVENTORY] Product status in the Warehouse panel doesn't update after delivery approval**

In the **Warehouse** panel on the product list, after approving a delivery, the product status remains as "awaiting delivery" and doesn't update to the correct status. This issue hampers warehouse inventory monitoring and can mislead warehouse staff.

**Steps to reproduce:**
1. Go to the **Warehouse** panel.
2. Approve a product delivery, which should change the product status.
3. Check the product list – notice that the status remains set as "awaiting delivery," even though the delivery receipt operation has been completed.

**Expected behavior:** 
After approving a delivery, the product status should be updated to the appropriate state (e.g., "available," "in stock," or another appropriate status) to clearly indicate the current availability of the product.

**Actual behavior:**
The product status doesn't automatically change after delivery approval, causing inconsistency between the actual warehouse state and the information displayed in the system.

---

**[USER MANAGEMENT] "Context menu in the Users section doesn't disappear after clicking on the account activation option"**

In the **User Management** view, the context menu expands correctly after right-clicking on a user profile. The problem is that after clicking on the account activation option (both for a single user and when trying to activate multiple accounts simultaneously), the context menu doesn't close. It should automatically disappear when the user clicks outside the menu or selects an option from the menu.

**Steps to reproduce:**
1. Go to the **Users** section and open the **User Management** view.
2. Right-click on a user profile to invoke the context menu – the menu expands.
3. Click on the "Activate account" option in the context menu.
4. Observe that the context menu doesn't disappear, even though it should close.

**Expected behavior:** 
The context menu should automatically disappear after performing the following actions:
* Clicking on any menu option (e.g., "Activate account," "Block access").
* Clicking outside the menu.
* Pressing the Escape key.

**Actual behavior:** 
The context menu remains visible and doesn't respond to clicks on menu options or clicks outside the menu, causing administrator confusion and requiring additional actions to close the menu.


### It's understood that screenshots, short videos, console content, or network information from devtools should be attached to the report.