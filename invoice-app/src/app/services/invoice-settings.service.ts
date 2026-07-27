import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

export interface InvoiceBrandingSettings {
  companyName: string;
  tagline: string;
  headerNote: string;
  footerNote: string;
  footerContact: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceSettingsService {
  private readonly brandingKey = 'invoice-branding-settings';
  private readonly themeKey = 'invoice-theme-mode';

  readonly branding = signal<InvoiceBrandingSettings>({
    companyName: 'InvoiceAutomation',
    tagline: 'Professional invoice generation for contractors',
    headerNote: 'Thank you for your business. Please remit payment by the due date.',
    footerNote: 'All work is subject to the agreed terms and conditions.',
    footerContact: 'support@invoiceautomation.app | +1 (555) 000-0000',
  });

  readonly theme = signal<ThemeMode>('light');

  constructor() {
    this.loadFromStorage();
  }

  updateBranding(partial: Partial<InvoiceBrandingSettings>): void {
    this.branding.update(current => ({ ...current, ...partial }));
    this.persistBranding();
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
    this.persistTheme();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedBranding = window.localStorage.getItem(this.brandingKey);
    if (storedBranding) {
      try {
        const parsed = JSON.parse(storedBranding) as Partial<InvoiceBrandingSettings>;
        this.branding.set({ ...this.branding(), ...parsed });
      } catch {
        // Ignore malformed values and keep defaults.
      }
    }

    const storedTheme = window.localStorage.getItem(this.themeKey) as ThemeMode | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      this.theme.set(storedTheme);
    }
  }

  private persistBranding(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.brandingKey, JSON.stringify(this.branding()));
  }

  private persistTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.themeKey, this.theme());
  }
}
