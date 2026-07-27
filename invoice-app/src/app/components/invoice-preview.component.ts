import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceDto } from '../models/invoice.models';
import { InvoiceSettingsService } from '../services/invoice-settings.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="preview-card" [class.dark-theme]="settings.theme() === 'dark'">
      <div class="preview-header">
        <div>
          <h3>{{ branding.companyName || 'InvoiceAutomation' }}</h3>
          <p>{{ branding.tagline || 'Professional invoice generation' }}</p>
        </div>
        <div class="header-note">{{ branding.headerNote }}</div>
      </div>

      <div class="preview-body">
        <div class="preview-meta">
          <div>
            <strong>Invoice #</strong>
            <div>{{ invoice?.invoiceNumber || 'INV-001' }}</div>
          </div>
          <div>
            <strong>Date</strong>
            <div>{{ invoice?.date || '2026-07-26' }}</div>
          </div>
          <div>
            <strong>Due Date</strong>
            <div>{{ invoice?.dueDate || '2026-08-25' }}</div>
          </div>
        </div>

        <div class="party-row">
          <div>
            <h4>From</h4>
            <div>{{ invoice?.from?.name || 'Your Company' }}</div>
            <div>{{ invoice?.from?.address || '123 Main Street' }}</div>
            <div>{{ invoice?.from?.city || 'City' }} {{ invoice?.from?.stateZip || 'State ZIP' }}</div>
          </div>
          <div>
            <h4>To</h4>
            <div>{{ invoice?.to?.name || 'Client Name' }}</div>
            <div>{{ invoice?.to?.address || '456 Client Avenue' }}</div>
            <div>{{ invoice?.to?.cityStateZip || 'Client City, State ZIP' }}</div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (line of invoice?.lines || []; track $index) {
              <tr>
                <td>{{ line.description }}</td>
                <td>{{ line.qty }}</td>
                <td>{{ line.rate | currency:'USD' }}</td>
                <td>{{ line.amount | currency:'USD' }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: {{ subtotal | currency:'USD' }}</div>
          <div>Tax: {{ taxAmount | currency:'USD' }}</div>
          <div>Total: {{ total | currency:'USD' }}</div>
        </div>
      </div>

      <div class="preview-footer">
        <div>{{ branding.footerNote }}</div>
        <div>{{ branding.footerContact }}</div>
      </div>
    </section>
  `,
  styles: [
    `
      .preview-card {
        border: 1px solid #d8e2ef;
        border-radius: 14px;
        padding: 1rem;
        background: #fff;
        color: #223143;
        box-shadow: 0 8px 24px rgba(13, 23, 35, 0.08);
      }
      .preview-card.dark-theme {
        background: #0f172a;
        color: #f8fafc;
        border-color: #334155;
      }
      .preview-header, .preview-footer {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
        padding: 0.8rem 0;
        border-bottom: 1px solid #e5ebf2;
      }
      .preview-card.dark-theme .preview-header, .preview-card.dark-theme .preview-footer {
        border-color: #334155;
      }
      .preview-header h3 { margin: 0; }
      .preview-header p { margin: 0.25rem 0 0; color: inherit; opacity: 0.75; }
      .header-note { max-width: 280px; text-align: right; font-size: 0.9rem; opacity: 0.82; }
      .preview-body { padding: 1rem 0; }
      .preview-meta, .party-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1rem; }
      .party-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .items-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
      .items-table th, .items-table td { border: 1px solid #e5ebf2; padding: 0.5rem; text-align: left; }
      .preview-card.dark-theme .items-table th, .preview-card.dark-theme .items-table td { border-color: #334155; }
      .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem; }
      @media (max-width: 720px) { .preview-meta, .party-row { grid-template-columns: 1fr; } }
    `
  ]
})
export class InvoicePreviewComponent implements OnChanges {
  @Input() invoice: InvoiceDto | null = null;
  @Input() subtotal = 0;
  @Input() taxAmount = 0;
  @Input() total = 0;

  branding: ReturnType<InvoiceSettingsService['branding']> extends Function ? never : any = {
    companyName: '',
    tagline: '',
    headerNote: '',
    footerNote: '',
    footerContact: '',
  };

  constructor(public settings: InvoiceSettingsService) {
    this.branding = this.settings.branding();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoice']) {
      this.branding = this.settings.branding();
    }
  }
}
