import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoiceDto } from '../models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoiceExportService {
  private apiBase = 'http://localhost:5000/api/invoice';

  constructor(private http: HttpClient) {}

  exportExcel(invoice: InvoiceDto): void {
    this.http
      .post(`${this.apiBase}/export/excel`, invoice, { responseType: 'blob' })
      .subscribe(blob => this.download(blob, `Invoice_${invoice.invoiceNumber}.xlsx`));
  }

  exportPdf(invoice: InvoiceDto): void {
    this.http
      .post(`${this.apiBase}/export/pdf`, invoice, { responseType: 'blob' })
      .subscribe(blob => this.download(blob, `Invoice_${invoice.invoiceNumber}.pdf`));
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
