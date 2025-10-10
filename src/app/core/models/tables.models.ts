export interface Deduction {
  label: string;
  value: number;
}
export interface Method {
  brand: 'visa' | 'mastercard' | 'pse' | 'amex' | 'nequi' | 'other';
  last4?: string; // para tarjetas
}
export interface Tx {
  status: 'success' | 'failed';
  date: string; // ISO (e.g., '2024-06-14T16:16:00')
  method: Method;
  boldId: string; // ID transacción Bold
  amount: number; // monto total (positivo)
  deductions?: Deduction[]; // valores a restar (positivos); se muestran en rojo
}
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

