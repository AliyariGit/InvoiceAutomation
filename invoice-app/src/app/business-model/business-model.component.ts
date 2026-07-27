import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-model',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bmc-wrapper">
      <div class="bmc-title">
        <h2>Business Model Canvas</h2>
        <p class="bmc-sub">ContractorInvoice — Construction Invoice Automation Platform</p>
      </div>

      <div class="bmc-grid">

        <!-- Row 1: Key Partners -->
        <div class="cell partners">
          <div class="cell-head">🤝 Key Partners</div>
          <ul>
            <li>Cloud hosting providers</li>
            <li>PDF & Excel library vendors</li>
            <li>Construction industry associations</li>
            <li>Accounting software integrations</li>
            <li>Payment gateway providers</li>
          </ul>
        </div>

        <!-- Row 1: Key Activities + Key Resources stacked -->
        <div class="cell-stack">
          <div class="cell activities">
            <div class="cell-head">⚙️ Key Activities</div>
            <ul>
              <li>Invoice generation & export</li>
              <li>8 invoice type templates</li>
              <li>PDF & Excel one-click export</li>
              <li>Line-item auto-calculation</li>
              <li>Tax & totals computation</li>
            </ul>
          </div>
          <div class="cell resources">
            <div class="cell-head">🏗 Key Resources</div>
            <ul>
              <li>Angular 18 web platform</li>
              <li>Invoice template engine</li>
              <li>Export API (.NET 8)</li>
              <li>8 flexible invoice types</li>
            </ul>
          </div>
        </div>

        <!-- Row 1: Value Propositions (tall) -->
        <div class="cell value">
          <div class="cell-head">💎 Value Propositions</div>
          <ul>
            <li>Instant professional invoices for contractors</li>
            <li>8 flexible invoice types in one tool</li>
            <li>One-click PDF & Excel export</li>
            <li>Auto-calculates tax & totals</li>
            <li>No account or signup required</li>
            <li>Works on any device (mobile-friendly)</li>
            <li>Free to use — no hidden fees</li>
          </ul>
        </div>

        <!-- Row 1: Customer Relations + Channels stacked -->
        <div class="cell-stack">
          <div class="cell relations">
            <div class="cell-head">💬 Customer Relationships</div>
            <ul>
              <li>Self-service, no login needed</li>
              <li>Always-on web access</li>
              <li>Intuitive type-selector UI</li>
              <li>Future: email support</li>
            </ul>
          </div>
          <div class="cell channels">
            <div class="cell-head">📡 Channels</div>
            <ul>
              <li>Direct web URL</li>
              <li>Wix website embed (iframe)</li>
              <li>Word of mouth / referrals</li>
              <li>Social media outreach</li>
            </ul>
          </div>
        </div>

        <!-- Row 1: Customer Segments -->
        <div class="cell segments">
          <div class="cell-head">👷 Customer Segments</div>
          <ul>
            <li>Independent contractors</li>
            <li>Small construction firms</li>
            <li>Subcontractors & tradespeople</li>
            <li>Renovation specialists</li>
            <li>Electricians & plumbers</li>
            <li>Landscapers & painters</li>
          </ul>
        </div>

        <!-- Row 2: Cost Structure -->
        <div class="cell costs">
          <div class="cell-head">💸 Cost Structure</div>
          <div class="two-col">
            <ul>
              <li>Web hosting & CDN</li>
              <li>Backend API server (.NET)</li>
              <li>PDF / Excel generation service</li>
            </ul>
            <ul>
              <li>Development & maintenance</li>
              <li>Domain & SSL certificate</li>
              <li>Customer support (future)</li>
            </ul>
          </div>
        </div>

        <!-- Row 2: Revenue Streams -->
        <div class="cell revenue">
          <div class="cell-head">💰 Revenue Streams</div>
          <div class="two-col">
            <ul>
              <li>Free tier (current MVP)</li>
              <li>Premium subscription (future)</li>
              <li>Per-export micro-fee (future)</li>
            </ul>
            <ul>
              <li>White-label licensing</li>
              <li>Enterprise API access</li>
              <li>Sponsored invoice templates</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .bmc-wrapper { font-family: inherit; }

    .bmc-title { text-align: center; margin-bottom: 1.5rem; }
    .bmc-title h2 { margin: 0 0 .3rem; font-size: 1.5rem; color: #1C396B; }
    .bmc-sub { margin: 0; color: #666; font-size: .9rem; }

    .bmc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1.4fr 1fr 1fr;
      grid-template-rows: auto auto;
      gap: .75rem;
    }

    .cell-stack {
      display: flex;
      flex-direction: column;
      gap: .75rem;
    }

    .cell {
      background: #fff;
      border-radius: 10px;
      padding: 1rem 1.1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
      border-top: 4px solid #ccc;
    }

    .partners  { border-top-color: #6c7fd8; }
    .activities{ border-top-color: #f0973a; }
    .resources { border-top-color: #e8c03a; }
    .value     { border-top-color: #1C396B; background: #f0f4ff; grid-row: 1; }
    .relations { border-top-color: #3aab8c; }
    .channels  { border-top-color: #5bc0eb; }
    .segments  { border-top-color: #e84d6e; }
    .costs     {
      border-top-color: #9b59b6;
      grid-column: 1 / 3;
    }
    .revenue   {
      border-top-color: #27ae60;
      grid-column: 3 / 6;
    }

    .cell-head {
      font-weight: 700;
      font-size: .82rem;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: #1C396B;
      margin-bottom: .6rem;
      padding-bottom: .4rem;
      border-bottom: 1px solid #eee;
    }

    ul { margin: 0; padding-left: 1.1rem; }
    li { font-size: .83rem; color: #444; margin-bottom: .3rem; line-height: 1.4; }

    .two-col { display: flex; gap: 1.5rem; }
    .two-col ul { flex: 1; }

    @media (max-width: 700px) {
      .bmc-grid { grid-template-columns: 1fr; }
      .costs, .revenue { grid-column: 1; }
      .two-col { flex-direction: column; gap: .5rem; }
    }
  `]
})
export class BusinessModelComponent {}
