export interface Deduction {
  label: string;
  value: number;
}
export interface Method {
  brand: string;
  last4?: string; // para tarjetas
}

export interface Tx {
  status: 'success' | 'failed';
  date: string;
  method: Method;
  boldId: string;
  amount: number;
  salesType: string;
  deductions: Deduction[];
}[]

export interface LabelTx {
  name: string;
  class?: string;
}

export interface ApiTx {
  id: string;
  status: 'SUCCESSFUL' | 'REJECTED';
  createdAt: number;
  paymentMethod: string;
  amount: number;
  transactionReference: number;
  salesType: 'TERMINAL' | 'PAYMENT_LINK';
}

export interface ApiResponse {
  data: ApiTx[];
}

