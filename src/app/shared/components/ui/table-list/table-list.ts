import { Component, computed, effect, Input, input, OnInit, signal } from '@angular/core';
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
import { LabelTx } from '@core/models/tables.models';
import { ExternalFilters, PaymentMethod, PaymentOption } from '@core/models/BtnExtension.models';

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
  ],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
  viewProviders: [provideIcons({ matTapAndPlayOutline, bootstrapLink45deg, ionSearch })],
})
export class TableList {
  @Input() labels: LabelTx[] = [];
  @Input() cols: number = 4;
  body = input.required<any[]>();
  @Input() isSearch: boolean = false;
  SearchExternal = input.required<any | null>();
  @Input() isLegend: boolean = false;
  @Input() legend: string = '';

  // búsqueda
  search = signal('');

  blockChars: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-:$/]+$/;

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const external = this.SearchExternal();
    const list = this.body();

    // ─── Fechas ──────────────────────────────────────────────
    const start = external?.state?.start ? new Date(external.state.start) : null;
    const end = external?.state?.end ? new Date(external.state.end) : null;

    // ─── Tipos de pago seleccionados ─────────────────────────
    const selectedPayments = Object.values(external?.payment ?? {})
      .filter((p: any) => p.key)
      .map((p: any) => p.key); // ejemplo: ['PAYMENT_LINK', 'TERMINAL']

      console.log('selectedPayments ==> ', selectedPayments);


    const allPaymentsSelected = selectedPayments.includes('TODOS') || selectedPayments.length === 0;

    // ─── Filtro principal ────────────────────────────────────
    return list.filter((tx) => {
      const statusTxt = tx.status === 'success' ? 'cobro exitoso' : 'cobro no realizado';
      const methodTxt = `${tx.method.brand}${tx.method.last4 ?? ''}`;

      // texto libre del input
      const matchSearch =
        !term ||
        [statusTxt, this.formatDateTime(tx.date), methodTxt, tx.boldId, this.toCOP(tx.amount)]
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

  constructor() {
    effect(() => {
      // console.log('Transactions updated:', this.body().length);
      // console.log('SearchExternal updated:', this.SearchExternal());
    });
  }

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
