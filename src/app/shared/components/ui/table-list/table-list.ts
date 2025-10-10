import { Component, computed, Input, input, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLink45deg } from '@ng-icons/bootstrap-icons';
import { ionSearch } from '@ng-icons/ionicons';
import { matTapAndPlayOutline } from '@ng-icons/material-icons/outline';
import { KeyFilterModule } from 'primeng/keyfilter';
import { LabelTx } from '@core/models/tables.model';

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
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    KeyFilterModule,
    NgIcon,
  ],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
  viewProviders: [provideIcons({ matTapAndPlayOutline, bootstrapLink45deg, ionSearch })],
})
export class TableList {

  @Input() labels: LabelTx[] = []
  @Input() body: any[] = []
  @Input() cols: number = 4;
  @Input() isSearch: boolean = false;
  @Input() isLegend: boolean = false;
  @Input() legend: string = '';


  // búsqueda
  search:string = '';
  query: FormControl = new FormControl('');

  blockChars: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-:/]+$/;

  filtered = computed(() => {
    const q = this.query.value.trim().toLowerCase();
    if (!q) return this.body;
    return this.body.filter((tx) => {
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
