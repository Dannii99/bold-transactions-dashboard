import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapInfoCircle } from '@ng-icons/bootstrap-icons';
import { saxSetting4Outline } from '@ng-icons/iconsax/outline';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableList } from '@shared/components/ui/table-list/table-list';
import { LabelTx, Tx } from '@core/models/tables.model';
import { ButtonExtension } from '@shared/components/ui/button-extension/button-extension';
import { State } from '@core/models/stateOptions';


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
    ButtonExtension
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  viewProviders: [provideIcons({ bootstrapInfoCircle, saxSetting4Outline })],
})
export class Dashboard {

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
    const state = this.stateOptions().find(e => e.value === this.state());
    return state ? state.label.toLowerCase() : 'N/A';
  });



  // Signal para el título formateado según la selección
  dateCard = computed(() => {
    const today = new Date();
    const month = today.toLocaleString('es-ES', { month: 'long' });
    const year = today.getFullYear();

    switch (this.state()) {
      // Hoy
      case 1:
        return `${today.getDate()} ${month}, ${year}`;

      // Esta semana
      case 2: {
        const day = today.getDay(); // 0=domingo
        const diffToMonday = (day + 6) % 7; // distancia a lunes
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const format = (d: Date) =>
          `${d.getDate()} ${d.toLocaleString('es-ES', { month: 'long' })}, ${d.getFullYear()}`;

        return `${format(monday)} - ${format(sunday)}`;
      }

      // Mes actual
      case 3:
        return `${this.currentMonth()}, ${year}`;

      default:
        return '';
    }
  });

   // - Button filter __________________

  titleFilter: string = 'Filtrar';
  categories: any[] = [
    { name: 'Cobro con datáfono', key: 1 },
    { name: 'Cobro con link de pago', key: 2 },
    { name: 'Ver todos', key: 3 },
  ];



  // - Table _________________________________

  labelTxs:LabelTx[] = [
    {
      name: 'Transacción',
      class: 'col-span-3'
    },
    {
      name: 'Fecha y hora',
      class: 'col-span-3'
    },
    {
      name: 'Método de pago',
      class: 'col-span-3'
    },
    {
      name: 'ID transacción Bold',
      class: 'col-span-3'
    },
    {
      name: 'Monto',
      class: 'col-span-2 text-left'
    }
  ]

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


}
