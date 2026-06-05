import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceType } from '../../models/invoice.models';

interface TypeOption {
  value: InvoiceType;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-invoice-type-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="type-selector">
      <h3>Invoice Type</h3>
      <div class="type-grid">
        @for (opt of options; track opt.value) {
          <button
            class="type-btn"
            [class.active]="selected === opt.value"
            (click)="select(opt.value)"
          >
            <span class="type-label">{{ opt.label }}</span>
            <span class="type-hint">{{ opt.hint }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .type-selector { margin-bottom: 1.5rem; }
    h3 { margin: 0 0 .75rem; font-size: .85rem; text-transform: uppercase; color: #666; letter-spacing: .05em; }
    .type-grid { display: flex; flex-wrap: wrap; gap: .5rem; }
    .type-btn {
      display: flex; flex-direction: column; align-items: flex-start;
      padding: .5rem .9rem; border: 2px solid #ddd; background: #fff;
      border-radius: 6px; cursor: pointer; transition: all .15s;
    }
    .type-btn:hover { border-color: #1C396B; }
    .type-btn.active { border-color: #1C396B; background: #1C396B; color: #fff; }
    .type-label { font-weight: 600; font-size: .9rem; }
    .type-hint { font-size: .72rem; opacity: .75; margin-top: 2px; }
    .type-btn.active .type-hint { opacity: .85; }
  `]
})
export class InvoiceTypeSelectorComponent {
  @Input() selected: InvoiceType = 'LaborOnly';
  @Output() typeChange = new EventEmitter<InvoiceType>();

  options: TypeOption[] = [
    { value: 'LaborOnly', label: 'Labor Only', hint: 'Worker · Hours · Rate/hr' },
    { value: 'MaterialsOnly', label: 'Materials Only', hint: 'Item · Supplier · Qty · Unit Price' },
    { value: 'Combined', label: 'Combined', hint: 'Labor & Material rows' },
    { value: 'FixedPrice', label: 'Fixed Price', hint: 'Flat project amount' },
    { value: 'UnitPrice', label: 'Unit Price', hint: 'Unit · Qty · Price/unit' },
    { value: 'HourlyDaily', label: 'Hourly/Daily', hint: 'Worker · Days · Rate/day' },
  ];

  select(type: InvoiceType): void {
    this.typeChange.emit(type);
  }
}
