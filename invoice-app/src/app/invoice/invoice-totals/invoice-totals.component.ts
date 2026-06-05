import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-totals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="totals">
      <div class="row">
        <span>Subtotal</span>
        <span>{{ subtotal | number:'1.2-2' }}</span>
      </div>
      <div class="row">
        <span>Tax ({{ taxRate | number:'1.0-2' }}%)</span>
        <span>{{ tax | number:'1.2-2' }}</span>
      </div>
      <div class="row grand">
        <span>Grand Total</span>
        <span>{{ grand | number:'1.2-2' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .totals {
      display: flex; flex-direction: column; align-items: flex-end;
      gap: .35rem; min-width: 220px;
    }
    .row {
      display: flex; justify-content: space-between; width: 220px;
      padding: .3rem .5rem; font-size: .9rem;
    }
    .row span:last-child { font-family: monospace; }
    .grand {
      background: #1C396B; color: #fff;
      border-radius: 4px; font-weight: 700; font-size: 1rem;
    }
  `]
})
export class InvoiceTotalsComponent {
  @Input() subtotal = 0;
  @Input() taxRate = 0;

  get tax(): number { return this.subtotal * this.taxRate / 100; }
  get grand(): number { return this.subtotal + this.tax; }
}
