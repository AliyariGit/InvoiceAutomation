import { Component } from '@angular/core';
import { InvoiceShellComponent } from './invoice/invoice-shell/invoice-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceShellComponent],
  template: '<app-invoice-shell />'
})
export class AppComponent {}
