import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceDto, InvoiceType, LineItemDto } from '../../models/invoice.models';
import { InvoiceTypeSelectorComponent } from '../invoice-type-selector/invoice-type-selector.component';
import { LineItemsTableComponent } from '../line-items-table/line-items-table.component';
import { InvoiceTotalsComponent } from '../invoice-totals/invoice-totals.component';
import { InvoiceExportService } from '../../services/invoice-export.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvoiceTypeSelectorComponent,
    LineItemsTableComponent,
    InvoiceTotalsComponent,
  ],
  template: `
    <form [formGroup]="form" class="invoice-form" (ngSubmit)="onSubmit()">

      <app-invoice-type-selector
        [selected]="selectedType"
        (typeChange)="onTypeChange($event)"
      />

      <!-- Header -->
      <section class="card">
        <h2 class="section-title">Invoice Details</h2>
        <div class="row-3">
          <label>Invoice #
            <input formControlName="invoiceNumber" placeholder="INV-001" />
          </label>
          <label>Date
            <input type="date" formControlName="date" />
          </label>
          <label>Due Date
            <input type="date" formControlName="dueDate" />
          </label>
        </div>
      </section>

      <!-- From / To -->
      <div class="two-col">
        <section class="card" formGroupName="from">
          <h2 class="section-title">From (Contractor)</h2>
          <label>Name <input formControlName="name" placeholder="Your Company" /></label>
          <label>Phone <input formControlName="phone" placeholder="+1 555-000-0000" /></label>
          <label>Email <input type="email" formControlName="email" placeholder="you@example.com" /></label>
        </section>

        <section class="card" formGroupName="to">
          <h2 class="section-title">To (Client)</h2>
          <label>Client Name <input formControlName="name" placeholder="Client Corp" /></label>
          <label>Project Name <input formControlName="projectName" placeholder="Office Renovation" /></label>
          <label>Site Address <input formControlName="siteAddress" placeholder="123 Main St" /></label>
        </section>
      </div>

      <!-- Line Items -->
      <section class="card">
        <h2 class="section-title">Line Items</h2>
        <app-line-items-table
          [invoiceType]="selectedType"
          [lines]="lines"
          (linesChange)="lines = $event"
          (subtotalChange)="subtotal = $event"
        />
      </section>

      <!-- Tax + Totals -->
      <section class="card">
        <div class="totals-row">
          <label class="tax-label">
            Tax Rate (%)
            <input type="number" min="0" max="100" step="0.01"
              formControlName="taxRate" style="width:90px" />
          </label>
          <app-invoice-totals [subtotal]="subtotal" [taxRate]="form.value.taxRate || 0" />
        </div>
      </section>

      <!-- Notes -->
      <section class="card">
        <h2 class="section-title">Notes / Payment Terms</h2>
        <textarea formControlName="notes" rows="3" placeholder="Payment due within 30 days..."></textarea>
      </section>

      <!-- Export -->
      <div class="export-bar">
        <button type="button" class="btn excel" (click)="exportExcel()">Export Excel (.xlsx)</button>
        <button type="button" class="btn pdf" (click)="exportPdf()">Export PDF</button>
      </div>
    </form>
  `,
  styles: [`
    .invoice-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .card {
      background: #fff; border-radius: 8px; padding: 1.2rem 1.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,.08);
    }
    .section-title {
      margin: 0 0 .9rem; font-size: .8rem; text-transform: uppercase;
      color: #1C396B; letter-spacing: .06em; font-weight: 700;
    }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }
    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
    @media (max-width: 560px) { .row-3 { grid-template-columns: 1fr; } }
    label { display: flex; flex-direction: column; gap: .25rem;
      font-size: .82rem; font-weight: 600; color: #444; margin-bottom: .6rem; }
    input:not([type=date]):not([type=number]),
    input[type=date], input[type=number] {
      padding: .38rem .55rem; border: 1px solid #d0d5de; border-radius: 5px;
      font-size: .9rem; transition: border-color .15s;
    }
    input:focus { outline: none; border-color: #1C396B; }
    textarea {
      width: 100%; box-sizing: border-box; border: 1px solid #d0d5de;
      border-radius: 5px; padding: .5rem .6rem; font-size: .9rem; resize: vertical;
    }
    textarea:focus { outline: none; border-color: #1C396B; }
    .totals-row { display: flex; justify-content: space-between; align-items: flex-end; }
    .tax-label { flex-direction: row; align-items: center; gap: .5rem; margin: 0; }
    .export-bar { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn {
      padding: .55rem 1.4rem; border: none; border-radius: 6px;
      cursor: pointer; font-size: .9rem; font-weight: 700; transition: opacity .15s;
    }
    .btn:hover { opacity: .85; }
    .excel { background: #1d6f42; color: #fff; }
    .pdf { background: #c00; color: #fff; }
  `]
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup;
  selectedType: InvoiceType = 'LaborOnly';
  lines: LineItemDto[] = [];
  subtotal = 0;

  constructor(private fb: FormBuilder, private exportSvc: InvoiceExportService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

    this.form = this.fb.group({
      invoiceNumber: ['INV-001', Validators.required],
      date: [today, Validators.required],
      dueDate: [due, Validators.required],
      taxRate: [0],
      notes: [''],
      from: this.fb.group({
        name: ['', Validators.required],
        phone: [''],
        email: [''],
      }),
      to: this.fb.group({
        name: ['', Validators.required],
        projectName: [''],
        siteAddress: [''],
      }),
    });
  }

  onTypeChange(type: InvoiceType): void {
    this.selectedType = type;
    this.lines = [];
    this.subtotal = 0;
  }

  private buildDto(): InvoiceDto {
    const v = this.form.value;
    return {
      invoiceNumber: v.invoiceNumber,
      date: v.date,
      dueDate: v.dueDate,
      invoiceType: this.selectedType,
      from: v.from,
      to: v.to,
      lines: this.lines,
      taxRate: v.taxRate ?? 0,
      notes: v.notes ?? '',
    };
  }

  exportExcel(): void {
    this.exportSvc.exportExcel(this.buildDto());
  }

  exportPdf(): void {
    this.exportSvc.exportPdf(this.buildDto());
  }

  onSubmit(): void {}
}
