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
      @if (discount > 0) {
        <div class="row discount">
          <span>Discount ({{ discount | number:'1.0-2' }}%)</span>
          <span>− {{ discountAmt | number:'1.2-2' }}</span>
        </div>
      }
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
    .discount { color: #c00; }
    .grand {
      background: #1C396B; color: #fff;
      border-radius: 4px; font-weight: 700; font-size: 1rem;
    }
  `]
})
export class InvoiceTotalsComponent {
  @Input() subtotal = 0;
  @Input() taxRate = 0;
  @Input() discount = 0;

  get discountAmt(): number { return +(this.subtotal * this.discount / 100).toFixed(2); }
  get tax(): number { return +((this.subtotal - this.discountAmt) * this.taxRate / 100).toFixed(2); }
  get grand(): number { return +(this.subtotal - this.discountAmt + this.tax).toFixed(2); }
}
