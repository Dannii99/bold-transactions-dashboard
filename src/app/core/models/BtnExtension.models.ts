export interface PaymentMethod {
  name: string;
  key: string;
}[]


export interface PaymentOption {
  name: string;
  key: string;
  selected?: boolean;
}

export interface ExternalFilters {
  state?: { start: string; end: string };
  payment?: Record<string, PaymentOption>;
}
