# Design

## Visual Identity

| Token | Value | Usage |
|---|---|---|
| Primary navy | `#1C396B` | Header bar, table headers, Grand Total row, section labels |
| Alternate row | `#EBF0FA` | Even rows in line items table |
| White | `#FFFFFF` | Card backgrounds, odd rows |
| Error red | `#CC0000` | Delete row button |

**Typography:** Segoe UI / system-ui (UI), Arial (PDF export)

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  🏗 ContractorInvoice                      [navy header] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  INVOICE TYPE                                           │
│  [ Labor Only ▼] [Materials Only] [Combined] ...        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ INVOICE DETAILS                                  │   │
│  │  Invoice #    │   Date      │   Due Date         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────┐  ┌──────────────────────────┐     │
│  │ FROM            │  │ TO                        │     │
│  │ Name            │  │ Client Name               │     │
│  │ Phone           │  │ Project Name              │     │
│  │ Email           │  │ Site Address              │     │
│  └─────────────────┘  └──────────────────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LINE ITEMS                                       │   │
│  │ [Description][Worker][Hours][Rate/hr][Amount][x] │   │
│  │ ...rows...                                       │   │
│  │ [+ Add Row]                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Tax Rate (%)  [___]          Subtotal      0.00        │
│                               Tax (0%)      0.00        │
│                             ┌──────────────────────┐   │
│                             │ Grand Total    0.00   │   │
│                             └──────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ NOTES / PAYMENT TERMS                            │   │
│  │ [textarea]                                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                    [Export Excel] [Export PDF]          │
└─────────────────────────────────────────────────────────┘
```

---

## PDF Layout (A4)

```
┌──────────────────────────────────────────────────────┐
│ INVOICE                    Invoice # INV-001          │
│ Type: LaborOnly            Date: 2026-06-05           │
│                            Due:  2026-07-05           │
├──────────────────────┬───────────────────────────────┤
│ FROM                 │ TO                             │
│ Rocky Ridge          │ Greenfield Properties LLC      │
│ 555-823-1100         │ Project: Warehouse Expansion   │
│ billing@...          │ 400 Industrial Blvd            │
├──────────────────────┴───────────────────────────────┤
│ Description    Worker       Hours   Rate/hr   Amount  │
├───────────────────────────────────────────────────────┤
│ Foundation...  Mike Torres  40.00   85.00  3,400.00   │
│ Roof Truss...  Dan Park     24.00   95.00  2,280.00   │ ← alt shading
├───────────────────────────────────────────────────────┤
│                              Subtotal       7,440.00  │
│                              Tax (8.5%)       632.40  │
│                           ┌──────────────────────────┤
│                           │ GRAND TOTAL     8,072.40  │
│                           └──────────────────────────┤
├───────────────────────────────────────────────────────┤
│ Notes / Payment Terms                                 │
│ Payment due net 30. Bank transfer preferred.          │
└───────────────────────────────────────────────────────┘
```

---

## Excel Layout

```
Row  1:  INVOICE  (merged A1:E1, navy, 18pt)
Row  2:  Invoice #: INV-001       Date: 2026-06-05
Row  3:  Type: LaborOnly          Due Date: 2026-07-05
Row  5:  FROM (bold navy)         TO (bold navy)
Row  6:  Rocky Ridge Contractors  Greenfield Properties LLC
Row  7:  555-823-1100             Warehouse Expansion
Row  8:  billing@rockyridge.com   400 Industrial Blvd
Row 10:  [Description][Worker][Hours][Rate/hr][Amount]  ← freeze pane here
Row 11:  Foundation Framing  Mike Torres  40  85  3400.00
Row 12:  Roof Truss...       Dan Park     24  95  2280.00  ← alt shading
Row 14:                                  Subtotal  7440.00
Row 15:                                  Tax 8.5%   632.40
Row 16:                              GRAND TOTAL  8072.40  ← navy bg, bold
Row 18:  Notes / Payment Terms: (bold)
Row 19:  Payment due net 30...  (merged, word-wrap)
```

---

## Component Interactions

```
InvoiceTypeSelectorComponent
        │ (typeChange) emit InvoiceType
        ▼
InvoiceFormComponent
        │ resets lines[], passes invoiceType down
        ▼
LineItemsTableComponent
        │ reads INVOICE_TYPE_COLUMNS[invoiceType] for headers
        │ (linesChange) emit LineItemDto[]
        │ (subtotalChange) emit number
        ▼
InvoiceFormComponent
        │ passes subtotal + taxRate down
        ▼
InvoiceTotalsComponent
        │ computes tax = subtotal × taxRate/100
        │ displays subtotal / tax / grand total
```

---

## Responsive Breakpoints

| Breakpoint | Layout change |
|---|---|
| `> 640px` | FROM/TO panels side by side (2-col grid) |
| `≤ 640px` | FROM/TO panels stacked |
| `> 560px` | Invoice details 3-col |
| `≤ 560px` | Invoice details stacked |
| Any | Line items table: `overflow-x: auto` (horizontal scroll on small screens) |
