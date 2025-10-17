export interface PaymentMethod {
  name: string;
  key: string;
  disabled?: boolean
}

export interface PaymentOption {
  name: string;
  key: string;
  selected?: boolean;
  selectedcheck?:PaymentOption,
}

export interface BaseFilters<TState> {
  state: TState;
  payment?: Record<string, PaymentOption | PaymentOption[]> | Record<string, never>;
}

export type PaymentFilters = BaseFilters<number>;

export type ExternalFilters = BaseFilters<{ start: string | Date; end: string | Date }>;
