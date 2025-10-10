import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapInfoCircle } from '@ng-icons/bootstrap-icons';
import { saxSetting4Outline } from '@ng-icons/iconsax/outline';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableList } from '@shared/components/ui/table-list/table-list';
import { LabelTx, Tx } from '@core/models/tables.models';
import { ButtonExtension } from '@shared/components/ui/button-extension/button-extension';
import { State } from '@core/models/stateOptions.models';
import { DashboardService } from './services/dashboard-service';
import { PaymentMethod } from '@core/models/BtnExtension.models';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    NgIcon,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableList,
    ButtonExtension,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  viewProviders: [provideIcons({ bootstrapInfoCircle, saxSetting4Outline })],
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  constructor() {
    effect(() => {
      this.paymentFilters.update((prev) => {
        return { state: this.dateRange(), payment: { ...prev.payment } };
      });
    });
  }

  // currency
  currency = signal<string | null>('9,1233,950');

  // - State ___________________________

  private baseOptions = signal<State[]>([
    { label: 'Hoy', value: 1 },
    { label: 'Esta semana', value: 2 },
    { label: 'N/A', value: 3 },
  ]);

  state = signal<number | null>(1);

  // Signal computada que genera el mes actual
  private currentMonth = computed(() => {
    const month = new Date().toLocaleString('es-ES', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  });

  // Computed que reemplaza el label dinámico con el mes actual
  stateOptions = computed(() => {
    return this.baseOptions().map((opt) =>
      opt.value === 3 ? { ...opt, label: this.currentMonth() } : opt
    );
  });

  // Signal computada que obtiene el label según el ID seleccionado
  StateTitle = computed(() => {
    const state = this.stateOptions().find((e) => e.value === this.state());
    return state ? state.label.toLowerCase() : 'N/A';
  });

  // Signal para el título formateado según la selección
  dateCard = computed(() => {
    const today = new Date();
    const month = today.toLocaleString('es-ES', { month: 'long' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = today.getFullYear();

    switch (this.state()) {
      // Hoy
      case 1:
        return `${today.getDate()} de ${capitalizedMonth} ${year}`;

      // Esta semana
      case 2: {
        const day = today.getDay(); // 0=domingo
        const diffToMonday = (day + 6) % 7; // distancia a lunes
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const format = (d: Date) => {
          return `${d.getDate()} ${capitalizedMonth} ${d.getFullYear()}`;
        };

        return `${format(monday)} - ${format(sunday)}`;
      }

      // Mes actual
      case 3:
        return `${this.currentMonth()}, ${year}`;

      default:
        return '';
    }
  });


  // Rango de fechas real para filtrar
  dateRange = computed(() => {
    const today = new Date();
    const value = this.state();

    if (value === 1) {
      // Hoy
      const start = new Date(today.setHours(0, 0, 0, 0));
      const end = new Date(today.setHours(23, 59, 59, 999));
      return { start, end };
    }

    if (value === 2) {
      // Semana actual (lunes a domingo)
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return { start: monday, end: sunday };
    }

    if (value === 3) {
      // Mes actual
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      return { start: firstDay, end: lastDay };
    }

    return null;
  });

  // - Button filter __________________

  titleFilter: string = 'Filtrar';
  paymentMethod: PaymentMethod[] = [
    { name: 'Cobro con datáfono', key: 'TERMINAL' },
    { name: 'Cobro con link de pago', key: 'PAYMENT_LINK' },
    { name: 'Ver todos', key: 'TODOS' },
  ];

  paymentFilters = signal<any>([]);
  onFilterChange(updated: Partial<typeof this.paymentFilters>) {
    this.paymentFilters.update((prev) => {
      return { state: this.dateRange(), payment: { ...updated } };
    });
  }

  // - Table _________________________________

  labelTxs: LabelTx[] = [
    {
      name: 'Transacción',
      class: 'col-span-3',
    },
    {
      name: 'Fecha y hora',
      class: 'col-span-3',
    },
    {
      name: 'Método de pago',
      class: 'col-span-3',
    },
    {
      name: 'ID transacción Bold',
      class: 'col-span-3',
    },
    {
      name: 'Monto',
      class: 'col-span-2 text-left',
    },
  ];

  txs = signal<Tx[]>([]);

  filterTableTxs = computed(() => {
    return this.paymentFilters();
  });

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.dashboardService.getTransactions().subscribe({
      next: (value) => {
        this.txs.set(value);
        // console.log('Tabla: ', value);
      },
    });
  }
}
