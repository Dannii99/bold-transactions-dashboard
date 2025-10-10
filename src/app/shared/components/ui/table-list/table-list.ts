import { Component, computed, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface Deduction {
  label: string;
  value: number;
}
interface Method {
  brand: 'visa' | 'mastercard' | 'pse' | 'amex' | 'nequi' | 'other';
  last4?: string; // para tarjetas
}
interface Tx {
  status: 'success' | 'failed';
  date: string; // ISO (e.g., '2024-06-14T16:16:00')
  method: Method;
  boldId: string; // ID transacción Bold
  amount: number; // monto total (positivo)
  deductions?: Deduction[]; // valores a restar (positivos); se muestran en rojo
}

@Component({
  selector: 'b-table-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet,
    InputTextModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  // búsqueda
  query: FormControl = new FormControl('');

  // Demo data (reemplaza con tu API)
  txs = signal<Tx[]>([
    {
      status: 'failed',
      date: '2024-06-14T16:16:00',
      method: { brand: 'visa', last4: '6544' },
      boldId: 'GZENWZBAAX9W',
      amount: 180000,
    },
    {
      status: 'success',
      date: '2024-06-13T16:16:00',
      method: { brand: 'pse' },
      boldId: 'GZENHP6WDV96V',
      amount: 80000,
      deductions: [{ label: 'Deducción Bold', value: 2400 }],
    },
    {
      status: 'success',
      date: '2024-06-14T03:42:31',
      method: { brand: 'mastercard', last4: '1214' },
      boldId: 'GZENMQ9QZFN8Y',
      amount: 90000,
      deductions: [{ label: 'Deducción Bold', value: 2700 }],
    },
    {
      status: 'success',
      date: '2024-06-14T16:16:00',
      method: { brand: 'visa', last4: '4324' },
      boldId: 'GZENW805EHB4O',
      amount: 122200,
      deductions: [{ label: 'Deducción Bold', value: 3666 }],
    },
    {
      status: 'failed',
      date: '2024-06-14T16:16:00',
      method: { brand: 'other', last4: '7657' },
      boldId: 'GZEN2JLEMU2D6',
      amount: 80000,
    },
    {
      status: 'success',
      date: '2024-06-14T03:42:31',
      method: { brand: 'visa', last4: '8768' },
      boldId: 'GZENMVU9H08F6',
      amount: 1155500,
      deductions: [{ label: 'Deducción Bold', value: 34665 }],
    },
    {
      status: 'failed',
      date: '2024-06-14T16:16:00',
      method: { brand: 'pse' },
      boldId: 'GZENU8IIRFKCI',
      amount: 100000,
    },
  ]);

  filtered = computed(() => {
    const q = this.query.value.trim().toLowerCase();
    if (!q) return this.txs();
    return this.txs().filter((tx) => {
      const statusTxt = tx.status === 'success' ? 'cobro exitoso' : 'cobro no realizado';
      const methodTxt = `${tx.method.brand}${tx.method.last4 ?? ''}`;
      return [statusTxt, this.formatDateTime(tx.date), methodTxt, tx.boldId, this.toCOP(tx.amount)]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  });

  // Helpers de formato
  toCOP(n: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }
  formatDateTime(iso: string): string {
    const d = new Date(iso);
    // Ej: 14/6/2024 - 16:16:00
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} - ${hh}:${mi}:${ss}`;
  }
}
