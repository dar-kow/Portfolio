## Test Cases - Invoice Module (light version)

These test cases cover the most important scenarios for the invoice module:

1. **TC-FAK-001** - Successful creation and approval of an invoice:
   - Tests the basic "happy path" for invoice creation
   - Verifies the correctness of amount and tax calculations
   - Checks state transitions from Draft to Approved invoice

2. **TC-FAK-002** - Validation of incorrect invoice data:
   - Tests data validation mechanisms
   - Verifies if the system correctly detects various types of errors
   - Checks error messages

3. **TC-FAK-003** - Cancellation of an issued invoice:
   - Tests the invoice cancellation process
   - Verifies required information (reason for cancellation)
   - Checks the edit lock on a cancelled invoice
# 



## Detailed test cases - Invoice Module (solid version)

#### **TC_FAK_001.GivenUserCreatesNewInvoiceAndFillsAllRequiredFields_WhenUserValidatesAndApproves_ThenInvoiceIsSuccessfullyCreated**

**Title:** Successful creation and approval of a new invoice.

**Description**: The test case covers the complete process of creating a new invoice with filling in all required fields and its approval using the graphical user interface.

| **No.** | **Action** | **Effect** |
|:---:|---|---|
| **1** | Click on the invoice icon in the side menu. | The *Invoices* section opens |
| **2** | Click on the *New invoice* button in the upper right corner of the application | Expect a *snackbar* to appear informing about the successful creation of the invoice. The system creates a new invoice in the "Draft" state. |
| **3** | In the *Customer* section, click the *Select* button | A dialog box with a list of available customers will open. |
| **4** | Select a customer from the list (e.g., "XYZ Company") | The customer data will be entered into the invoice form. |
| **5** | In the *Invoice data* section, set the issue date to the current day | The issue date will be updated. |
| **6** | Set the sale date to the current day | The sale date will be updated. |
| **7** | Set the payment term to 14 days from the issue date | The payment term will be updated. |
| **8** | In the *Payment method* section, select: *Bank transfer* | The payment method will be set to "Bank transfer". |
| **9** | Click the *Add item* button | An invoice item addition window will open. |
| **10** | In the add item window, select "Product A" from the list | The product will be selected. |
| **11** | Set the quantity to "2" | The quantity will be updated. |
| **12** | Set the net unit price to "100.00" | The price will be updated. |
| **13** | Select VAT rate "23%" | The VAT rate will be updated. |
| **14** | Click the *Add* button | The item will be added to the invoice. The system will automatically calculate the net, VAT, and gross values. |
| **15** | Click the *Verify* button | The system will start the invoice data verification process. |
| **16** | Wait for the verification to complete | The system will change the invoice state to "Approved" and display an appropriate message. |
| **17** | Click the *Issue invoice* button | The invoice will be issued (state change to "Issued") and will receive a number. |
| **18** | Click the *Download PDF* button | The system will generate a PDF file with the invoice. |

**Expected result**: After performing all steps, an invoice will be created, approved, and issued with correctly calculated amounts (net: 200.00, VAT: 46.00, gross: 246.00). The invoice will be available for download in PDF format.

---

#### **TC_FAK_002.GivenUserStartsEditingExistingInvoice_WhenInvalidDataIsEntered_ThenValidationErrorMessagesAreDisplayed**

**Title:** Validation of incorrect data during invoice editing.

**Description**: The test case verifies validation mechanisms during editing of an existing invoice by entering incorrect data in various fields and checking error messages.

| **No.** | **Action** | **Effect** |
|:---:|---|---|
| **1** | Click on the invoice icon in the side menu. | The *Invoices* section opens |
| **2** | From the invoice list, select an invoice in the "Draft" state | The invoice details view will open. |
| **3** | Click the *Edit* button | The invoice form will switch to edit mode. |
| **4** | In the *Customer* section, click the *Clear* button | The customer data will be cleared. |
| **5** | In the *Invoice data* section, set the issue date to the current day | The issue date will be updated. |
| **6** | Set the sale date to 40 days before the issue date | The sale date will be updated. |
| **7** | Set the payment term to the day before the issue date | The payment term will be updated. |
| **8** | Click the *Add item* button | An invoice item addition window will open. |
| **9** | In the add item window, select "Product B" from the list | The product will be selected. |
| **10** | Set the quantity to "-2" (negative quantity) | The quantity will be entered. |
| **11** | Set the net unit price to "100.00" | The price will be updated. |
| **12** | Select VAT rate "23%" | The VAT rate will be updated. |
| **13** | Click the *Add* button | The system will display an error message: "Quantity must be greater than zero". |
| **14** | Correct the quantity to "2" and click the *Add* button | The item will be added to the invoice. |
| **15** | Click the *Verify* button | The system will start the invoice data verification process and display errors: "Customer is required", "Sale date cannot be earlier than 30 days from the issue date", "Payment term cannot be earlier than the issue date". |
| **16** | Correct the customer data by selecting a company from the list | The customer data will be completed. |
| **17** | Correct the sale date to the current day | The sale date will be updated. |
| **18** | Correct the payment term to 14 days from the issue date | The payment term will be updated. |
| **19** | Click the *Verify* button again | The system will perform verification and change the invoice state to "Approved". |

**Expected result**: The system will correctly identify all errors in the invoice data and display appropriate validation messages. After correcting the errors, the invoice will successfully pass the verification process and will be approved.

---

#### **TC_FAK_003.GivenInvoiceIsInIssuedState_WhenUserSelectsCorrectionOption_ThenCorrectionInvoiceIsCreatedWithProperReference**

**Title:** Creating a correction invoice.

**Description**: The test case covers the process of creating a correction invoice for an existing, issued invoice, including specifying the reason for the correction and linking it to the original invoice.

| **No.** | **Action** | **Effect** |
|:---:|---|---|
| **1** | Click on the invoice icon in the side menu. | The *Invoices* section opens |
| **2** | From the invoice list, select an invoice in the "Issued" state | The invoice details view will open. |
| **3** | Click the *Create correction* button | A form for creating a correction invoice will open with predefined data from the original invoice. |
| **4** | In the *Correction reason* section, enter "Change in product quantity" | The correction reason will be saved. |
| **5** | Verify that the form displays the number of the invoice being corrected | The system should display information about the original invoice number. |
| **6** | In the invoice items section, find the "Product A" item | The item will be displayed with data from the original invoice. |
| **7** | Click the *Edit* button next to the "Product A" item | An item editing window will open. |
| **8** | Change the quantity from "2" to "1" | The quantity will be updated. |
| **9** | Click the *Save* button | The item will be updated, and the system will automatically calculate new net, VAT, and gross values, as well as the difference compared to the original invoice. |
| **10** | Verify that the system displays both the original values and the values after correction | The system should show: Before correction (2 pcs., 200.00 net), After correction (1 pc., 100.00 net), Difference (-1 pc., -100.00 net). |
| **11** | Click the *Verify* button | The system will start the correction invoice data verification process. |
| **12** | Wait for the verification to complete | The system will change the correction invoice state to "Approved" and display an appropriate message. |
| **13** | Click the *Issue correction invoice* button | The correction invoice will be issued and receive a number in the format "CORRECTION/[original invoice number]". |
| **14** | Click the *Download PDF* button | The system will generate a PDF file with the correction invoice. |
| **15** | Return to the invoice list | The list of invoices will be displayed. |
| **16** | Check if the original invoice is marked as "Corrected" | The original invoice should be marked as "Corrected" with a reference to the correction invoice. |

**Expected result**: After performing all steps, a correction invoice will be created and issued with a correct reference to the original invoice. The correction invoice will contain information about the differences in values before and after the correction. The original invoice will be marked as corrected.

## Benefits of a systematic approach to test documentation

Using detailed test cases in the GIVEN-WHEN-THEN format with numbering and tabular presentation of steps brings a number of measurable benefits for the entire development team:

### Data consistency and understanding within the team

1. **Uniform interpretation of requirements** - Precise test cases ensure that all team members understand the functionality in the same way. This eliminates interpretative discrepancies between developers, testers, and business analysts.

2. **Consistent mental model** - The GIVEN-WHEN-THEN format creates a common language and mental model for the entire team, which facilitates communication and reduces errors resulting from misunderstandings.

3. **Clarity of states and transitions between them** - The presentation of the invoice state diagram and related test cases gives a comprehensive picture of the document lifecycle, which ensures a consistent understanding of data flow.

### Usefulness for automated tests

1. **Ready basis for automation** - Detailed test steps with precisely defined actions and expected results can be directly translated into automation scripts, saving time on analysis and test design.

2. **Easier assertion implementation** - Each "THEN" in the GIVEN-WHEN-THEN structure can be directly translated into assertions in automated tests, which increases the accuracy and completeness of verification.

3. **Easier regression detection** - Precise test scenarios allow for quick detection of regression through automatic execution of all defined steps and verification of results.

4. **Test maintainability** - When automated tests are based on well-defined test cases, changes in functionality can be more easily tracked and both documentation and test code can be updated.

### Documentation for future team members

1. **Shortened onboarding time** - New team members can quickly understand how the system works by analyzing state diagrams and detailed test cases, without the need to dig through source code.

2. **Source of domain knowledge** - Test cases serve not only as technical documentation but also contain valuable information about business logic and domain rules.

3. **Living documentation** - Regularly maintained test cases constitute current system documentation that evolves along with the product, unlike traditional documentation that often becomes outdated.

4. **Self-documenting requirements** - The GIVEN-WHEN-THEN format combined with test steps allows new team members to understand not only HOW the system works but also WHY it works in a certain way.

### Additional business benefits

1. **Reduced error costs** - Precise tests reduce the number of errors that make it to production, which directly translates into financial savings and better product reputation.

2. **Increased transparency for stakeholders** - Test cases in an understandable format can also be presented to non-technical stakeholders, which increases their trust in the development process.

3. **Accelerated requirements validation** - Test cases in the GIVEN-WHEN-THEN format can be verified by the business even before implementation, which allows for early detection of inconsistencies in requirements.

Adopting such a systematic approach to testing and documentation creates a positive cycle in which each new test enriches the team's knowledge base, improves communication, and enhances the quality of the end product.