import { Component } from '@angular/core';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoice-shell',
  standalone: true,
  imports: [InvoiceFormComponent],
  template: `
    <div class="shell">
      <header class="app-header">
        <div class="logo">
          <span class="logo-icon">🏗</span>
          <span class="logo-text">ContractorInvoice</span>
        </div>
      </header>
      <main class="content">
        <app-invoice-form />
      </main>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; background: #f0f2f7; }
    .app-header {
      background: #1C396B; color: #fff; padding: .8rem 1.5rem;
      display: flex; align-items: center;
    }
    .logo { display: flex; align-items: center; gap: .6rem; }
    .logo-icon { font-size: 1.4rem; }
    .logo-text { font-size: 1.2rem; font-weight: 700; letter-spacing: .02em; }
    .content { max-width: 980px; margin: 1.5rem auto; padding: 0 1rem 3rem; }
  `]
})
export class InvoiceShellComponent {}
