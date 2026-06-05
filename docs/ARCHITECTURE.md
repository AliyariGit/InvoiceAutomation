# Architecture

## Overview

```
Browser (Angular 18)
      │
      │  HTTP POST /api/invoice/export/{excel|pdf}
      │  JSON body: InvoiceDto
      ▼
.NET 8 Web API  (localhost:5000)
      │
      ├── ExcelExportService  →  EPPlus  →  .xlsx bytes
      └── PdfExportService    →  QuestPDF →  .pdf bytes
```

The frontend never stores invoice data — it assembles the form state into an `InvoiceDto` on export and streams the file directly to the browser download.

---

## Data Flow

```
User fills form
      │
      ▼
InvoiceFormComponent (reactive form)
      │  builds InvoiceDto on export click
      ▼
InvoiceExportService.exportExcel() / exportPdf()
      │  HTTP POST with JSON body
      │  responseType: 'blob'
      ▼
InvoiceController (.NET)
      │  deserializes InvoiceDto
      ▼
ExcelExportService / PdfExportService
      │  generates file bytes
      ▼
File() response  →  browser download
```

---

## Frontend Component Tree

```
AppComponent
└── InvoiceShellComponent          (page layout + header)
    └── InvoiceFormComponent        (reactive form hub)
        ├── InvoiceTypeSelectorComponent   (6-type button grid)
        ├── LineItemsTableComponent        (dynamic rows)
        ├── InvoiceTotalsComponent         (live subtotal/tax/grand)
        └── [export buttons]               → InvoiceExportService
```

### Key design choices

**`INVOICE_TYPE_COLUMNS`** — a static map in `invoice.models.ts` that defines which columns (field name, label, input type, width) appear for each invoice type. Switching type replaces this map reference; Angular re-renders the table via `@for`.

**`LineItemsTableComponent`** — owns the `lines[]` array and emits it up via `linesChange`. Amount is auto-calculated (`qty × rate`) on every input change, except for `FixedPrice` where the user enters the amount directly.

**`InvoiceFormComponent`** — owns the reactive form for header fields (invoice #, dates, from/to). On export it assembles `InvoiceDto` from the form value + current `lines[]` and delegates to `InvoiceExportService`.

---

## Backend Service Design

### ExcelExportService

Uses **EPPlus** with `LicenseContext.NonCommercial`.

Layout is built row-by-row (imperative):
1. Title row (merged, branded color)
2. Invoice meta (number, dates)
3. FROM / TO info blocks
4. Column headers (freeze pane at header row)
5. Line item rows (alternating shading)
6. Totals rows — column indices computed dynamically from `headers.Length` so all 6 invoice types align correctly
7. Notes (merged, word-wrap)

### PdfExportService

Uses **QuestPDF** Community license.

Layout is declarative (fluent API):
- `page.Header()` — INVOICE title + invoice meta (two-column row)
- `page.Content()` — column of:
  - FROM/TO row (two bordered panels)
  - Line items table (column widths proportional per invoice type)
  - Totals table (right-anchored via `Row → RelativeItem spacer + ConstantItem`)
  - Notes box

**Critical:** Number alignment in table cells uses `TextDescriptor.AlignRight()` (inside the `Text(t => { t.AlignRight(); })` callback), NOT `IContainer.AlignRight()`. The container version aligns relative to the page, causing column overflow.

---

## Shared Model (InvoiceDto)

```
InvoiceDto
├── invoiceNumber: string
├── date: string (ISO)
├── dueDate: string (ISO)
├── invoiceType: string  (one of 6 enum values)
├── from: ContractorInfo  { name, phone, email }
├── to:   ClientInfo      { name, projectName, siteAddress }
├── lines: LineItemDto[]  { description, worker?, supplier?, unit?, type?, qty, rate, amount }
├── taxRate: number
└── notes: string
```

The same DTO is used by both export endpoints and defined in both TypeScript (`invoice.models.ts`) and C# (`InvoiceDto.cs`). ASP.NET Core's default JSON deserializer is case-insensitive, so camelCase from Angular maps to PascalCase C# properties automatically.

---

## CORS

The API uses a wildcard CORS policy (`AllowAnyOrigin`) to allow the Angular dev server (port 4200) to call the API (port 5000) without configuration. In production this should be locked to the actual frontend origin.
