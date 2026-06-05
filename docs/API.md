# API Reference

Base URL (development): `http://localhost:5000`

---

## Endpoints

### `POST /api/invoice/export/excel`

Returns a `.xlsx` file download.

**Response headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="Invoice_INV-001.xlsx"
```

---

### `POST /api/invoice/export/pdf`

Returns a `.pdf` file download.

**Response headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Invoice_INV-001.pdf"
```

---

## Request Body — `InvoiceDto`

```json
{
  "invoiceNumber": "INV-2026-001",
  "date": "2026-06-05",
  "dueDate": "2026-07-05",
  "invoiceType": "LaborOnly",
  "from": {
    "name": "Rocky Ridge Contractors",
    "phone": "555-823-1100",
    "email": "billing@rockyridge.com"
  },
  "to": {
    "name": "Greenfield Properties LLC",
    "projectName": "Warehouse Expansion",
    "siteAddress": "400 Industrial Blvd, Denver CO"
  },
  "lines": [
    {
      "description": "Foundation Framing",
      "worker": "Mike Torres",
      "qty": 40,
      "rate": 85.00,
      "amount": 3400.00
    },
    {
      "description": "Roof Truss Installation",
      "worker": "Dan Park",
      "qty": 24,
      "rate": 95.00,
      "amount": 2280.00
    }
  ],
  "taxRate": 8.5,
  "notes": "Payment due net 30. Bank transfer preferred."
}
```

---

## Field Reference

### `InvoiceDto`

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceNumber` | string | ✓ | e.g. `INV-2026-001` |
| `date` | string (ISO date) | ✓ | Invoice date |
| `dueDate` | string (ISO date) | ✓ | Payment due date |
| `invoiceType` | string enum | ✓ | See invoice types below |
| `from` | ContractorInfo | ✓ | Contractor details |
| `to` | ClientInfo | ✓ | Client details |
| `lines` | LineItemDto[] | ✓ | One or more line items |
| `taxRate` | number | | Tax percentage (e.g. `8.5` = 8.5%). Default 0 |
| `notes` | string | | Payment terms / notes |

### `ContractorInfo`

| Field | Type | Description |
|---|---|---|
| `name` | string | Contractor / company name |
| `phone` | string | Contact phone |
| `email` | string | Contact email |

### `ClientInfo`

| Field | Type | Description |
|---|---|---|
| `name` | string | Client name |
| `projectName` | string | Project name |
| `siteAddress` | string | Job site address |

### `LineItemDto`

| Field | Type | Used by types | Description |
|---|---|---|---|
| `description` | string | All | Line description |
| `worker` | string | LaborOnly, HourlyDaily | Worker name |
| `supplier` | string | MaterialsOnly | Supplier name |
| `unit` | string | UnitPrice | Unit label (e.g. "sqft") |
| `type` | string | Combined | "Labor" or "Material" |
| `qty` | number | All except FixedPrice | Quantity / hours / days |
| `rate` | number | All except FixedPrice | Rate per unit |
| `amount` | number | All | Row total (Qty × Rate, or direct for FixedPrice) |

---

## Invoice Types

| Value | Description | Required line item fields |
|---|---|---|
| `LaborOnly` | Labor work by hour | description, worker, qty (hours), rate, amount |
| `MaterialsOnly` | Material purchases | description, supplier, qty, rate (unit price), amount |
| `Combined` | Mixed labor and materials | description, type, qty, rate, amount |
| `FixedPrice` | Single flat fee | description, amount (entered directly) |
| `UnitPrice` | Priced per unit | description, unit, qty, rate (price/unit), amount |
| `HourlyDaily` | Daily rate work | description, worker, qty (days), rate (per day), amount |

---

## Totals Calculation

```
Subtotal  = sum(lines[].amount)
Tax       = Subtotal × (taxRate / 100)
Grand Total = Subtotal + Tax
```

All monetary values are formatted to 2 decimal places in both exports.

---

## cURL Examples

**Excel export:**
```bash
curl -X POST http://localhost:5000/api/invoice/export/excel \
  -H "Content-Type: application/json" \
  -d @invoice.json \
  -o Invoice_001.xlsx
```

**PDF export:**
```bash
curl -X POST http://localhost:5000/api/invoice/export/pdf \
  -H "Content-Type: application/json" \
  -d @invoice.json \
  -o Invoice_001.pdf
```
