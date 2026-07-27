import { Injectable } from '@angular/core';
import { InvoiceDto } from '../models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoiceExportService {
  exportExcel(invoice: InvoiceDto): void {
    const data = JSON.stringify(invoice, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    this.download(blob, `Invoice_${invoice.invoiceNumber}.json`);
  }

  exportPdf(invoice: InvoiceDto): void {
    const printable = this.buildPrintableHtml(invoice);
    const newWindow = window.open('', '_blank', 'width=900,height=700');
    if (!newWindow) {
      return;
    }

    newWindow.document.write(printable);
    newWindow.document.close();
    newWindow.focus();
    setTimeout(() => newWindow.print(), 250);
  }

  private buildPrintableHtml(invoice: InvoiceDto): string {
    const lines = (invoice.lines || []).map(line => `
      <tr>
        <td>${this.escape(line.description || '')}</td>
        <td>${this.escape(String(line.qty || 0))}</td>
        <td>${this.escape(String(line.rate || 0))}</td>
        <td>${this.escape(String(line.amount || 0))}</td>
      </tr>
    `).join('');

    const subtotal = (invoice.lines || []).reduce((sum, line) => sum + (line.amount || 0), 0);
    const tax = subtotal * ((invoice.taxRate || 0) / 100);
    const total = subtotal + tax;

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice ${this.escape(invoice.invoiceNumber || '')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1C396B; padding-bottom:12px; margin-bottom:16px; }
            .meta { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px; }
            table { width:100%; border-collapse:collapse; margin-top:8px; }
            th, td { border:1px solid #d1d5db; padding:8px; text-align:left; }
            th { background:#1C396B; color:#fff; }
            .totals { margin-top:16px; display:flex; justify-content:flex-end; }
            .totals div { min-width:220px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>InvoiceAutomation</h2>
              <div>Professional invoice generation</div>
            </div>
            <div><strong>Invoice #</strong> ${this.escape(invoice.invoiceNumber || '')}<br />${this.escape(invoice.date || '')}</div>
          </div>
          <div class="meta">
            <div><strong>From</strong><br />${this.escape(invoice.from?.name || '')}</div>
            <div><strong>To</strong><br />${this.escape(invoice.to?.name || '')}</div>
            <div><strong>Due</strong><br />${this.escape(invoice.dueDate || '')}</div>
          </div>
          <table>
            <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
            <tbody>${lines}</tbody>
          </table>
          <div class="totals">
            <div><strong>Subtotal:</strong> ${this.escape(String(subtotal))}</div>
            <div><strong>Tax:</strong> ${this.escape(String(tax))}</div>
            <div><strong>Total:</strong> ${this.escape(String(total))}</div>
          </div>
        </body>
      </html>`;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
