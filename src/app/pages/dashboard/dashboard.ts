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
import {
  ExternalFilters,
  PaymentFilters,
  PaymentMethod,
  PaymentOption,
} from '@core/models/paymentFilters.models';
import { SkeletonModule } from 'primeng/skeleton';
import { toCOP } from '@core/functions';
import { StatesService } from '@core/services/states.service';
import { CopPipe } from '@shared/pipes/cop.pipe';


enum Status {
  Hoy = 1,
  Semana = 2,
  Mes = 3,
}

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
    SkeletonModule,
    CopPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  viewProviders: [provideIcons({ bootstrapInfoCircle, saxSetting4Outline })],
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private statesService = inject(StatesService);
  private isInitialized = false;

  constructor() {
    // cargar el filtro guardado (por si el ButtonExtension ya guardó algo)
    const saved: PaymentFilters = {
      state: 1,
      ...(this.statesService.loadFilter() ?? {}),
    };

    if (saved && Object.keys(saved).length) {
      this.state.set(saved.state);
    }

    // Ahora marcamos que ya inicializó
    this.isInitialized = true;

    // Effect para guardar solo si ya está inicializado
    effect(() => {
      if (!this.isInitialized) return;

      this.paymentFilters.update((prev) => ({
        state: this.dateRange(),
        payment: { ...prev.payment },
      }));

      // cargar el filtro guardado (por si el ButtonExtension ya guardó algo)
      const savedReactive: PaymentFilters = {
        state: 1,
        ...(this.statesService.loadFilter() ?? {}),
      };

      // combinar sin borrar lo existente
      const saveStore: PaymentFilters = {
        ...savedReactive,
        state: this.state(),
        payment: {
          ...savedReactive?.payment,
          ...this.paymentFilters().payment,
        },
      };

      this.statesService.saveFilter(saveStore);
    });
  }

  // - loading _____________________________

  loading = signal<boolean>(false);

  // - search _____________________________

  search = signal<string>('');

  // - currency ___________________________

  currency = signal<number>(0);

  updateTotal(value: number) {
    this.currency.set(value);
  }

  setToCOP(value: number): string {
    return toCOP(value);
  }

  // - State ___________________________

  private baseOptions = signal<State[]>([
    { label: 'Hoy', value: 1 },
    { label: 'Esta semana', value: 2 },
    { label: 'N/A', value: 3 },
  ]);

  state = signal<number>(1);

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
      case Status.Hoy:
        return `${today.getDate()} de ${capitalizedMonth} ${year}`;

      // Esta semana
      case Status.Semana: {
        const day = today.getDay();
        const diffToMonday = (day + 6) % 7;
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
      case Status.Mes:
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

    return { start: '', end: '' };
  });

  // - Button filter __________________
  titleFilter: string = 'Filtrar';
  paymentMethod: PaymentMethod[] = [
    { name: 'Cobro con datáfono', key: 'TERMINAL' },
    { name: 'Cobro con link de pago', key: 'PAYMENT_LINK' },
    { name: 'Ver todos', key: 'TODOS' },
  ];

  paymentFilters = signal<ExternalFilters>({
    state: { start: '', end: '' },
    payment: {},
  });

  onFilterChange(updated: PaymentMethod | PaymentMethod[]) {
    // Transformamos el tipo recibido al formato que espera paymentFilters
    const formatted = {
      Selectedcheck: Array.isArray(updated) ? updated : [updated],
    } as Record<string, PaymentOption | PaymentOption[]>;

    this.paymentFilters.update(() => ({
      state: this.dateRange(),
      payment: { ...formatted },
    }));
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
    this.loading.set(true);
/*     this.dashboardService.getTransactions().subscribe({
      next: (value) => {
        this.txs.set(value);
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    }); */
    this.dashboardService.getTransactionsLocal().subscribe({
      next: (value) => {
        this.txs.set(value);
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
