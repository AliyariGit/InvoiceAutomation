import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnDef, InvoiceType, INVOICE_TYPE_COLUMNS, LineItemDto } from '../../models/invoice.models';

function blankLine(): LineItemDto {
  return { description: '', qty: 0, rate: 0, amount: 0 };
}

@Component({
  selector: 'app-line-items-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            @for (col of columns; track col.field) {
              <th [style.width]="col.width">{{ col.label }}</th>
            }
            <th class="del-col"></th>
          </tr>
        </thead>
        <tbody>
          @for (line of lines; track $index; let i = $index) {
            <tr>
              @for (col of columns; track col.field) {
                <td>
                  @if (col.field === 'amount' && invoiceType !== 'FixedPrice') {
                    <span class="amount">{{ line.amount | number:'1.2-2' }}</span>
                  } @else if (col.type === 'number') {
                    <input
                      type="number" min="0" step="0.01"
                      [ngModel]="getField(line, col.field)"
                      (ngModelChange)="setField(line, col.field, $event, i)"
                    />
                  } @else {
                    <input
                      type="text"
                      [ngModel]="getField(line, col.field)"
                      (ngModelChange)="setField(line, col.field, $event, i)"
                    />
                  }
                </td>
              }
              <td class="del-col">
                <button class="del-btn" (click)="removeLine(i)" title="Remove row">✕</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <button class="add-btn" (click)="addLine()">+ Add Row</button>
    </div>
  `,
  styles: [`
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .88rem; }
    th {
      background: #1C396B; color: #fff;
      padding: .5rem .6rem; text-align: left; font-weight: 600; white-space: nowrap;
    }
    td { padding: .3rem .4rem; border-bottom: 1px solid #eee; vertical-align: middle; }
    tr:nth-child(even) td { background: #f5f7fb; }
    input[type=text], input[type=number] {
      width: 100%; box-sizing: border-box;
      border: 1px solid #ddd; border-radius: 3px; padding: .25rem .4rem;
      font-size: .88rem;
    }
    input:focus { outline: none; border-color: #1C396B; }
    .amount { font-family: monospace; display: block; text-align: right; padding-right: .3rem; }
    .del-col { width: 32px; }
    .del-btn {
      background: none; border: none; color: #c00; cursor: pointer;
      font-size: .85rem; padding: 2px 4px; border-radius: 3px;
    }
    .del-btn:hover { background: #fdd; }
    .add-btn {
      margin-top: .6rem; padding: .4rem .9rem;
      background: #fff; border: 2px dashed #1C396B; color: #1C396B;
      border-radius: 4px; cursor: pointer; font-size: .85rem; font-weight: 600;
    }
    .add-btn:hover { background: #edf0f8; }
  `]
})
export class LineItemsTableComponent implements OnChanges {
  @Input() invoiceType: InvoiceType = 'LaborOnly';
  @Input() lines: LineItemDto[] = [];
  @Output() linesChange = new EventEmitter<LineItemDto[]>();
  @Output() subtotalChange = new EventEmitter<number>();

  columns: ColumnDef[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceType']) {
      this.columns = INVOICE_TYPE_COLUMNS[this.invoiceType];
    }
  }

  getField(line: LineItemDto, field: string): unknown {
    return (line as unknown as Record<string, unknown>)[field];
  }

  setField(line: LineItemDto, field: string, value: unknown, index: number): void {
    (line as unknown as Record<string, unknown>)[field] = value;
    if (field === 'qty' || field === 'rate') {
      this.recalc(line);
    } else if (field === 'amount') {
      line.amount = +(Number(value)).toFixed(2);
    }
    this.emit();
  }

  private recalc(line: LineItemDto): void {
    if (this.invoiceType === 'FixedPrice') return;
    line.amount = +(line.qty * line.rate).toFixed(2);
  }

  addLine(): void {
    this.lines = [...this.lines, blankLine()];
    this.emit();
  }

  removeLine(i: number): void {
    this.lines = this.lines.filter((_, idx) => idx !== i);
    this.emit();
  }

  private emit(): void {
    this.linesChange.emit(this.lines);
    this.subtotalChange.emit(this.lines.reduce((s, l) => s + l.amount, 0));
  }
}
