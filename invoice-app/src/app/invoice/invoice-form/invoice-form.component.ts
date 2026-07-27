import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceDto, InvoiceType, LineItemDto } from '../../models/invoice.models';
import { InvoiceTypeSelectorComponent } from '../invoice-type-selector/invoice-type-selector.component';
import { LineItemsTableComponent } from '../line-items-table/line-items-table.component';
import { InvoiceTotalsComponent } from '../invoice-totals/invoice-totals.component';
import { InvoicePreviewComponent } from '../../components/invoice-preview.component';
import { InvoiceExportService } from '../../services/invoice-export.service';
import { InvoiceSettingsService } from '../../services/invoice-settings.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvoiceTypeSelectorComponent,
    LineItemsTableComponent,
    InvoiceTotalsComponent,
    InvoicePreviewComponent,
  ],
  template: `
    <form [formGroup]="form" class="invoice-form" (ngSubmit)="onSubmit()">
      <section class="toolbar-card" [class.dark-theme]="settings.theme() === 'dark'">
        <div class="toolbar-copy">
          <h2>Invoice Editor</h2>
          <p>Fill the details below and generate a polished PDF for your client.</p>
        </div>
        <div class="toolbar-actions">
          <button type="button" class="btn secondary" (click)="settings.toggleTheme()">
            {{ settings.theme() === 'light' ? '🌙 Dark mode' : '☀️ Light mode' }}
          </button>
        </div>
      </section>

      <section class="card" [class.dark-theme]="settings.theme() === 'dark'">
        <h2 class="section-title">Branding & Header / Footer</h2>
        <div class="row-2">
          <label>Company Name
            <input [value]="settings.branding().companyName" (input)="onBrandingChange('companyName', $any($event.target).value)" />
          </label>
          <label>Tagline
            <input [value]="settings.branding().tagline" (input)="onBrandingChange('tagline', $any($event.target).value)" />
          </label>
        </div>
        <div class="row-2">
          <label>Header Note
            <input [value]="settings.branding().headerNote" (input)="onBrandingChange('headerNote', $any($event.target).value)" />
          </label>
          <label>Footer Contact
            <input [value]="settings.branding().footerContact" (input)="onBrandingChange('footerContact', $any($event.target).value)" />
          </label>
        </div>
        <label>Footer Note
          <textarea rows="2" [value]="settings.branding().footerNote" (input)="onBrandingChange('footerNote', $any($event.target).value)"></textarea>
        </label>
      </section>

      <section class="preview-section">
        <app-invoice-preview [invoice]="getPreviewInvoice()" [subtotal]="subtotal" [taxAmount]="taxAmount" [total]="total"></app-invoice-preview>
      </section>

      <!-- Invoice Type -->
      <app-invoice-type-selector
        [selected]="selectedType"
        (typeChange)="onTypeChange($event)"
      />

      <!-- ── Invoice Details ─────────────────────────────── -->
      <section class="card">
        <h2 class="section-title">Invoice Details</h2>
        <div class="row-3">
          <label>Invoice #
            <input formControlName="invoiceNumber" placeholder="INV-001" />
          </label>
          <label>Invoice Date
            <input type="date" formControlName="date" />
          </label>
          <label>Due Date
            <input type="date" formControlName="dueDate" />
          </label>
        </div>
        <div class="row-3" style="margin-top:.8rem">
          <label>Payment Terms
            <select formControlName="paymentTerms">
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 7">Net 7 days</option>
              <option value="Net 15">Net 15 days</option>
              <option value="Net 30">Net 30 days</option>
              <option value="Net 45">Net 45 days</option>
              <option value="Net 60">Net 60 days</option>
              <option value="50% Upfront">50% Upfront</option>
            </select>
          </label>
          <label>Job / Contract #
            <input formControlName="jobNumber" placeholder="JOB-2024-001" />
          </label>
          <label>Currency
            <select formControlName="currency">
              <option value="USD">USD — US Dollar</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </label>
        </div>
      </section>

      <!-- ── Contractor / Client ─────────────────────────── -->
      <div class="two-col">

        <section class="card" formGroupName="from">
          <h2 class="section-title">🏗 Contractor (Bill From)</h2>

          <label>Business / Company Name <span class="req">*</span>
            <input formControlName="name" placeholder="ABC Construction LLC" />
          </label>
          <div class="row-2">
            <label>License #
              <input formControlName="licenseNo" placeholder="LIC-123456" />
            </label>
            <label>Tax ID / EIN
              <input formControlName="taxId" placeholder="XX-XXXXXXX" />
            </label>
          </div>
          <label>Street Address
            <input formControlName="address" placeholder="123 Builder Ave" />
          </label>
          <div class="row-2">
            <label>City
              <input formControlName="city" placeholder="Los Angeles" />
            </label>
            <label>State / ZIP
              <input formControlName="stateZip" placeholder="CA 90001" />
            </label>
          </div>
          <div class="row-2">
            <label>Phone
              <input formControlName="phone" placeholder="+1 555-000-0000" />
            </label>
            <label>Email
              <input type="email" formControlName="email" placeholder="you@company.com" />
            </label>
          </div>
          <label>Website
            <input formControlName="website" placeholder="www.yourcompany.com" />
          </label>
        </section>

        <section class="card" formGroupName="to">
          <h2 class="section-title">👤 Client (Bill To)</h2>

          <label>Company / Client Name <span class="req">*</span>
            <input formControlName="name" placeholder="XYZ Corporation" />
          </label>
          <label>Contact Person
            <input formControlName="contactPerson" placeholder="John Smith" />
          </label>
          <label>Street Address
            <input formControlName="address" placeholder="456 Client Blvd" />
          </label>
          <label>City / State / ZIP
            <input formControlName="cityStateZip" placeholder="New York, NY 10001" />
          </label>
          <div class="row-2">
            <label>Phone
              <input formControlName="phone" placeholder="+1 555-111-2222" />
            </label>
            <label>Email
              <input type="email" formControlName="email" placeholder="client@company.com" />
            </label>
          </div>
          <div class="row-2">
            <label>Project Name
              <input formControlName="projectName" placeholder="Office Renovation" />
            </label>
            <label>PO Number
              <input formControlName="poNumber" placeholder="PO-98765" />
            </label>
          </div>
          <label>Site / Job Address
            <input formControlName="siteAddress" placeholder="789 Work Site Rd" />
          </label>
        </section>

      </div>

      <!-- ── Line Items ──────────────────────────────────── -->
      <section class="card">
        <h2 class="section-title">Line Items</h2>
        <app-line-items-table
          [invoiceType]="selectedType"
          [lines]="lines"
          (linesChange)="lines = $event"
          (subtotalChange)="subtotal = $event"
        />
      </section>

      <!-- ── Discount + Tax + Totals ─────────────────────── -->
      <section class="card">
        <h2 class="section-title">Totals</h2>
        <div class="totals-row">
          <div class="totals-controls">
            <label class="inline-label">
              Discount (%)
              <input type="number" min="0" max="100" step="0.01"
                formControlName="discount" style="width:90px" />
            </label>
            <label class="inline-label">
              Tax Rate (%)
              <input type="number" min="0" max="100" step="0.01"
                formControlName="taxRate" style="width:90px" />
            </label>
          </div>
          <app-invoice-totals
            [subtotal]="subtotal"
            [discount]="form.value.discount || 0"
            [taxRate]="form.value.taxRate || 0"
          />
        </div>
      </section>

      <!-- ── Payment Information ─────────────────────────── -->
      <section class="card" formGroupName="payment">
        <h2 class="section-title">💳 Payment Information</h2>
        <label>Accepted Payment Methods
          <input formControlName="methods"
            placeholder="Bank Transfer, Check, Zelle, Credit Card" />
        </label>
        <div class="row-2">
          <label>Bank Name
            <input formControlName="bankName" placeholder="Chase Bank" />
          </label>
          <label>Account Name
            <input formControlName="accountName" placeholder="ABC Construction LLC" />
          </label>
        </div>
        <div class="row-2">
          <label>Account Number
            <input formControlName="accountNumber" placeholder="XXXXXXXXXXXX" />
          </label>
          <label>Routing Number
            <input formControlName="routingNumber" placeholder="XXXXXXXXX" />
          </label>
        </div>
        <label>Payment Instructions
          <textarea formControlName="instructions" rows="2"
            placeholder="Make checks payable to ABC Construction LLC. ACH transfers accepted.">
          </textarea>
        </label>
      </section>

      <!-- ── Notes / Terms ───────────────────────────────── -->
      <section class="card">
        <h2 class="section-title">Notes / Terms & Conditions</h2>
        <textarea formControlName="notes" rows="3"
          placeholder="e.g. Late payments subject to 1.5% monthly interest. All work guaranteed for 1 year.">
        </textarea>
      </section>

      <!-- ── Export ──────────────────────────────────────── -->
      <div class="export-bar">
        <button type="button" class="btn excel" (click)="exportExcel()">
          ⬇ Export Excel (.xlsx)
        </button>
        <button type="button" class="btn pdf" (click)="exportPdf()">
          ⬇ Export PDF
        </button>
      </div>

    </form>
  `,
  styles: [`
    .invoice-form { display: flex; flex-direction: column; gap: 1.2rem; }

    .toolbar-card, .card {
      background: #fff; border-radius: 10px; padding: 1.3rem 1.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,.08);
    }
    .toolbar-card { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .toolbar-copy h2 { margin: 0 0 .25rem; }
    .toolbar-copy p { margin: 0; color: #667085; }
    .toolbar-card.dark-theme, .card.dark-theme {
      background: #111827; color: #f8fafc;
    }
    .toolbar-card.dark-theme .toolbar-copy p, .card.dark-theme label { color: #cbd5e1; }
    .section-title {
      margin: 0 0 1rem; font-size: .78rem; text-transform: uppercase;
      color: #1C396B; letter-spacing: .06em; font-weight: 700;
      padding-bottom: .5rem; border-bottom: 2px solid #f0f2f7;
    }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    @media (max-width: 680px) { .two-col { grid-template-columns: 1fr; } }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; }
    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .8rem; }
    @media (max-width: 560px) {
      .row-2, .row-3 { grid-template-columns: 1fr; }
    }

    label {
      display: flex; flex-direction: column; gap: .25rem;
      font-size: .8rem; font-weight: 600; color: #555; margin-bottom: .65rem;
    }
    .req { color: #c00; }

    input, select, textarea {
      padding: .38rem .55rem; border: 1px solid #d0d5de; border-radius: 5px;
      font-size: .9rem; font-family: inherit; transition: border-color .15s;
      background: #fff;
    }
    input:focus, select:focus, textarea:focus {
      outline: none; border-color: #1C396B; box-shadow: 0 0 0 2px rgba(28,57,107,.1);
    }
    textarea { width: 100%; box-sizing: border-box; resize: vertical; }
    select { cursor: pointer; }

    .totals-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 1rem;
    }
    .totals-controls { display: flex; flex-direction: column; gap: .6rem; }
    .inline-label {
      flex-direction: row !important; align-items: center;
      gap: .6rem; margin-bottom: 0 !important;
    }

    .export-bar { display: flex; gap: 1rem; justify-content: flex-end; }
    .btn {
      padding: .6rem 1.6rem; border: none; border-radius: 6px;
      cursor: pointer; font-size: .92rem; font-weight: 700;
      transition: opacity .15s; letter-spacing: .02em;
    }
    .btn:hover { opacity: .85; }
    .secondary { background: #e5ecf8; color: #1C396B; }
    .excel { background: #1d6f42; color: #fff; }
    .pdf   { background: #c00;    color: #fff; }
    .preview-section { margin-top: .25rem; }
  `]
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup;
  selectedType: InvoiceType = 'LaborOnly';
  lines: LineItemDto[] = [];
  subtotal = 0;

  taxAmount = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private exportSvc: InvoiceExportService,
    public settings: InvoiceSettingsService,
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    const due   = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

    this.form = this.fb.group({
      invoiceNumber: ['INV-001', Validators.required],
      date:          [today, Validators.required],
      dueDate:       [due,   Validators.required],
      paymentTerms:  ['Net 30'],
      jobNumber:     [''],
      currency:      ['USD'],
      discount:      [0],
      taxRate:       [0],
      notes:         [''],

      from: this.fb.group({
        name:      ['', Validators.required],
        licenseNo: [''],
        taxId:     [''],
        address:   [''],
        city:      [''],
        stateZip:  [''],
        phone:     [''],
        email:     [''],
        website:   [''],
      }),

      to: this.fb.group({
        name:          ['', Validators.required],
        contactPerson: [''],
        address:       [''],
        cityStateZip:  [''],
        phone:         [''],
        email:         [''],
        projectName:   [''],
        poNumber:      [''],
        siteAddress:   [''],
      }),

      payment: this.fb.group({
        methods:       ['Bank Transfer, Check'],
        bankName:      [''],
        accountName:   [''],
        accountNumber: [''],
        routingNumber: [''],
        instructions:  [''],
      }),
    });

    this.updateTotals();
  }

  onTypeChange(type: InvoiceType): void {
    this.selectedType = type;
    this.lines = [];
    this.subtotal = 0;
    this.updateTotals();
  }

  onBrandingChange(field: 'companyName' | 'tagline' | 'headerNote' | 'footerNote' | 'footerContact', value: string): void {
    this.settings.updateBranding({ [field]: value } as any);
  }

  getPreviewInvoice(): InvoiceDto {
    return this.buildDto();
  }

  private buildDto(): InvoiceDto {
    const v = this.form.value;
    return {
      invoiceNumber: v.invoiceNumber,
      date:          v.date,
      dueDate:       v.dueDate,
      paymentTerms:  v.paymentTerms,
      jobNumber:     v.jobNumber ?? '',
      invoiceType:   this.selectedType,
      from:          v.from,
      to:            v.to,
      lines:         this.lines,
      discount:      v.discount ?? 0,
      taxRate:       v.taxRate  ?? 0,
      notes:         v.notes    ?? '',
      payment:       v.payment,
    };
  }

  private updateTotals(): void {
    const discount = Number(this.form?.value?.discount || 0);
    const taxRate = Number(this.form?.value?.taxRate || 0);
    const discountAmount = this.subtotal * (discount / 100);
    const taxableAmount = this.subtotal - discountAmount;
    this.taxAmount = taxableAmount * (taxRate / 100);
    this.total = taxableAmount + this.taxAmount;
  }

  exportExcel(): void { this.exportSvc.exportExcel(this.buildDto()); }
  exportPdf():   void { this.exportSvc.exportPdf(this.buildDto());   }
  onSubmit():    void {}
}
