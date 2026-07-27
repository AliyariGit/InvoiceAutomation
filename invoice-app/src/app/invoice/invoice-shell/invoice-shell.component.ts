import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { BusinessModelComponent } from '../../business-model/business-model.component';

@Component({
  selector: 'app-invoice-shell',
  standalone: true,
  imports: [CommonModule, InvoiceFormComponent, BusinessModelComponent],
  template: `
    <div class="shell">
      <header class="app-header">
        <div class="logo">
          <span class="logo-icon">🏗</span>
          <span class="logo-text">ContractorInvoice</span>
        </div>
        <nav class="nav">
          <button class="nav-btn" [class.active]="tab === 'invoice'" (click)="tab = 'invoice'">
            📄 Invoice
          </button>
          <button class="nav-btn" [class.active]="tab === 'bmc'" (click)="tab = 'bmc'">
            📊 Business Model
          </button>
        </nav>
      </header>
      <main class="content">
        @if (tab === 'invoice') {
          <app-invoice-form />
        } @else {
          <app-business-model />
        }
      </main>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; background: #f0f2f7; }
    .app-header {
      background: #1C396B; color: #fff; padding: .8rem 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { display: flex; align-items: center; gap: .6rem; }
    .logo-icon { font-size: 1.4rem; }
    .logo-text { font-size: 1.2rem; font-weight: 700; letter-spacing: .02em; }
    .nav { display: flex; gap: .5rem; }
    .nav-btn {
      background: rgba(255,255,255,.12); border: 2px solid transparent;
      color: #fff; padding: .4rem .9rem; border-radius: 6px;
      cursor: pointer; font-size: .88rem; font-weight: 600; transition: all .15s;
    }
    .nav-btn:hover { background: rgba(255,255,255,.22); }
    .nav-btn.active { background: #fff; color: #1C396B; border-color: #fff; }
    .content { max-width: 980px; margin: 1.5rem auto; padding: 0 1rem 3rem; }
  `]
})
export class InvoiceShellComponent {
  tab: 'invoice' | 'bmc' = 'invoice';
}
