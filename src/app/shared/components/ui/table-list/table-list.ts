import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { Deduction, LabelTx, Tx } from '@core/models/tables.models';
import { SkeletonModule } from 'primeng/skeleton';
import { toCOP } from '@core/functions';
import { DrawerDetailsComponent } from '../drawer-details/drawer-details.component';
import { formatDateTime } from '@core/functions/formatDate.functions';
import { ExternalFilters, PaymentMethod, PaymentOption } from '@core/models/paymentFilters.models';
import { CopPipe } from '@shared/pipes/cop.pipe';

@Component({
  selector: 'b-table-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    TagModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    KeyFilterModule,
    NgIcon,
    SkeletonModule,
    DrawerDetailsComponent,
    CopPipe
  ],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
  viewProviders: [provideIcons({ matTapAndPlayOutline, bootstrapLink45deg, ionSearch })],
})
export class TableList {
  loading = input<boolean>(false);
  labels = input<LabelTx[]>([]);
  cols = input.required<number>();
  body = input.required<Tx[]>();
  SearchExternal = input<ExternalFilters>({
    state: { start: '', end: '' },
    payment: {},
  });
  isSearch = input<boolean>(false);
  isLegend = input<boolean>(false);
  legend = input<string>('');

  totalChange = output<number>();

  // búsqueda
  search = signal<string>('');

  // drawer ____________________
  drawerVisible = signal<boolean>(false);

  defaultTx: Tx = {
    status: 'success',
    date: new Date().toISOString(),
    method: { brand: '' },
    boldId: '',
    amount: 0,
    salesType: '',
    deductions: [{ label: '', value: 0 }],
  };

  drawerParams = signal<Tx>(this.defaultTx);

  constructor() {
    effect(() => {
      this.totalChange.emit(this.TransaccionTotal());
    });
  }

  updateVisible(value: boolean) {
    this.drawerVisible.set(value);
  }

  // Computed: genera un array [1, 2, 3, ..., cols]
  skeletonList = computed(() => Array.from({ length: this.labels().length }, (_, i) => i + 1));

  blockChars: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-:$/]+$/;

  // Computed: filtro general de la tabla
  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const external = this.SearchExternal();
    const list = this.body();

    // ─── Fechas ──────────────────────────────────────────────
    const start = external?.state?.start ? new Date(external.state.start) : null;
    const end = external?.state?.end ? new Date(external.state.end) : null;

    // ─── Tipos de pago seleccionados ─────────────────────────
    const selectedPayments = Object.values(external?.payment ?? {})
      .filter((p): p is PaymentOption | PaymentOption[] => !!p)
      .flatMap((p) => (Array.isArray(p) ? p : [p])) // normaliza a array
      .filter((p): p is PaymentOption => !!p.key)
      .map((p) => p.key);

    const allPaymentsSelected = selectedPayments.includes('TODOS') || selectedPayments.length === 0;

    // ─── Filtro principal ────────────────────────────────────
    return list.filter((tx) => {
      const statusTxt = tx.status === 'success' ? 'cobro exitoso' : 'cobro no realizado';
      const methodTxt = `${tx.method.brand}${tx.method.last4 ?? ''}`;

      // texto libre del input
      const matchSearch =
        !term ||
        [statusTxt, formatDateTime(tx.date), methodTxt, tx.boldId, toCOP(tx.amount)]
          .join(' ')
          .toLowerCase()
          .includes(term);

      // rango de fechas
      const txDate = new Date(tx.date);
      const matchDate = !start || !end || (txDate >= start && txDate <= end);

      // tipo de cobro
      const matchPayment = allPaymentsSelected || selectedPayments.includes(tx.salesType);

      return matchSearch && matchDate && matchPayment;
    });
  });

  // Total de las transacciones filtradas
  TransaccionTotal = computed(() => {
    return this.filtered().reduce((acc, tx) => {
      const totalDeductions =
        tx.deductions?.reduce((sum: number, d: Deduction) => sum + d.value, 0) || 0;
      return acc + (tx.amount - totalDeductions);
    }, 0);
  });

  drawerOpen(tx: Tx) {
    this.drawerVisible.set(true);
    this.drawerParams.set(tx);
  }

  setToCOP(value: number): string {
    return toCOP(value);
  }
  setFormatDateTime(value: string): string {
    return formatDateTime(value);
  }
}
