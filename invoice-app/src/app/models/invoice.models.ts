export type InvoiceType =
  | 'LaborOnly'
  | 'MaterialsOnly'
  | 'Combined'
  | 'FixedPrice'
  | 'UnitPrice'
  | 'HourlyDaily'
  | 'AnyTime'
  | 'AnyType';

export interface ContractorInfo {
  name: string;
  address: string;
  city: string;
  stateZip: string;
  phone: string;
  email: string;
  licenseNo: string;
  taxId: string;
  website: string;
}

export interface ClientInfo {
  name: string;
  contactPerson: string;
  address: string;
  cityStateZip: string;
  phone: string;
  email: string;
  projectName: string;
  siteAddress: string;
  poNumber: string;
}

export interface PaymentInfo {
  methods: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  instructions: string;
}

export interface LineItemDto {
  description: string;
  worker?: string;
  supplier?: string;
  unit?: string;
  type?: string;
  serviceDate?: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface InvoiceDto {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  jobNumber: string;
  invoiceType: InvoiceType;
  from: ContractorInfo;
  to: ClientInfo;
  lines: LineItemDto[];
  discount: number;
  taxRate: number;
  notes: string;
  payment: PaymentInfo;
}

export interface ColumnDef {
  field: keyof LineItemDto | string;
  label: string;
  type: 'text' | 'number' | 'date';
  width?: string;
}

export const INVOICE_TYPE_COLUMNS: Record<InvoiceType, ColumnDef[]> = {
  LaborOnly: [
    { field: 'description', label: 'Description', type: 'text', width: '30%' },
    { field: 'worker', label: 'Worker', type: 'text', width: '20%' },
    { field: 'qty', label: 'Hours', type: 'number', width: '15%' },
    { field: 'rate', label: 'Rate/hr', type: 'number', width: '15%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '20%' },
  ],
  MaterialsOnly: [
    { field: 'description', label: 'Item', type: 'text', width: '25%' },
    { field: 'supplier', label: 'Supplier', type: 'text', width: '20%' },
    { field: 'qty', label: 'Qty', type: 'number', width: '15%' },
    { field: 'rate', label: 'Unit Price', type: 'number', width: '15%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '25%' },
  ],
  Combined: [
    { field: 'description', label: 'Description', type: 'text', width: '30%' },
    { field: 'type', label: 'Type', type: 'text', width: '15%' },
    { field: 'qty', label: 'Qty', type: 'number', width: '15%' },
    { field: 'rate', label: 'Rate', type: 'number', width: '15%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '25%' },
  ],
  FixedPrice: [
    { field: 'description', label: 'Project Description', type: 'text', width: '75%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '25%' },
  ],
  UnitPrice: [
    { field: 'description', label: 'Description', type: 'text', width: '30%' },
    { field: 'unit', label: 'Unit', type: 'text', width: '15%' },
    { field: 'qty', label: 'Qty', type: 'number', width: '15%' },
    { field: 'rate', label: 'Price/unit', type: 'number', width: '15%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '25%' },
  ],
  HourlyDaily: [
    { field: 'description', label: 'Description', type: 'text', width: '30%' },
    { field: 'worker', label: 'Worker', type: 'text', width: '20%' },
    { field: 'qty', label: 'Days', type: 'number', width: '15%' },
    { field: 'rate', label: 'Rate/day', type: 'number', width: '15%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '20%' },
  ],
  AnyTime: [
    { field: 'serviceDate', label: 'Date', type: 'date', width: '18%' },
    { field: 'description', label: 'Description', type: 'text', width: '32%' },
    { field: 'qty', label: 'Qty / Hrs', type: 'number', width: '13%' },
    { field: 'rate', label: 'Rate', type: 'number', width: '13%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '24%' },
  ],
  AnyType: [
    { field: 'description', label: 'Description', type: 'text', width: '30%' },
    { field: 'type', label: 'Category', type: 'text', width: '20%' },
    { field: 'qty', label: 'Qty', type: 'number', width: '13%' },
    { field: 'rate', label: 'Rate', type: 'number', width: '13%' },
    { field: 'amount', label: 'Amount', type: 'number', width: '24%' },
  ],
};
