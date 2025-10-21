import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentFilters, PaymentMethod } from '@core/models/paymentFilters.models';
import { StatesService } from '@core/services/states.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { saxSetting4Outline } from '@ng-icons/iconsax/outline';
import { ionClose } from '@ng-icons/ionicons';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'b-button-extension',
  imports: [CommonModule, ButtonModule, NgIcon, FormsModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: './button-extension.html',
  styleUrl: './button-extension.scss',
  viewProviders: [provideIcons({ saxSetting4Outline, ionClose })],
})
export class ButtonExtension {
  title = input<String>('Filtrar');
  checkFilter = input<PaymentMethod[]>([]);

  //@Output() filterChange = new EventEmitter();
  filterChange = output<PaymentMethod | PaymentMethod[]>();

  selectedcheck: PaymentMethod[] = [];
  isOpen = signal(false);

  private statesService = inject(StatesService);

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Si el click NO es dentro de un elemento con la clase 'toggle-filter'
    if (!target.closest('.toggle-filter-containt')) {
      this.isOpen.set(false);
    }
  }

  ngOnInit() {
    const saved: PaymentFilters = {
      state: 1,
      ...(this.statesService.loadFilter() ?? {}),
    };

    if (Array.isArray(saved?.payment?.['selectedcheck']) && saved.payment['selectedcheck'].length) {
      // 🔹 Buscar los objetos reales de checkFilter
      this.selectedcheck = this.checkFilter().filter((i) =>
        (saved?.payment?.['selectedcheck'] as Array<{ key: string }>).some((s) => s.key === i.key)
      );

      // 🔹 Reactivar los disabled si "TODOS" está marcado
      const allItem = this.checkFilter().find((i) => i.key === 'TODOS');
      if (this.selectedcheck.some((c) => c.key === 'TODOS') && allItem) {
        this.checkFilter().forEach((i) => {
          if (i.key !== 'TODOS') i.disabled = true;
        });
      }
    }

    this.filterChange.emit(this.selectedcheck);
  }

  // - payment method ________________________________

  onCheckChange(item: PaymentMethod) {
    const isAll = item.key === 'TODOS';
    const allItem = this.checkFilter().find((i) => i.key === 'TODOS');

    if (isAll) {
      const checked = this.selectedcheck.some((c) => c.key === 'TODOS');
      if (checked) {
        // Marcar todos los demás y deshabilitarlos
        this.selectedcheck = [...this.checkFilter()];
        this.checkFilter().forEach((i) => {
          if (i.key !== 'TODOS') i.disabled = true;
        });
      } else {
        // Desmarcar todos y habilitarlos
        this.selectedcheck = [];
        this.checkFilter().forEach((i) => (i.disabled = false));
      }
    } else {
      // Si marca/desmarca otro, controlar "Ver todos"
      const othersChecked = this.selectedcheck.filter((i) => i.key !== 'TODOS').length;
      if (othersChecked !== this.checkFilter.length - 1) {
        // Hay alguno sin marcar → desmarcar "Ver todos"
        allItem && (this.selectedcheck = this.selectedcheck.filter((i) => i.key !== 'TODOS'));
        allItem && (allItem.disabled = false);
      }
    }
  }

  closet(event: Event) {
    event.stopPropagation();
    this.isOpen.set(false);
  }

  append() {
    this.isOpen.set(true);
  }

  toggle() {
    this.isOpen.update((value) => !value);
  }

  submit(event: Event) {
    // emitir el filtro al padre
    this.filterChange.emit(this.selectedcheck);

    // guardar en localStorage (sin tocar lo demás del filtro)
    const saved: PaymentFilters = {
      state: 1,
      ...(this.statesService.loadFilter() ?? {}),
    };

    const newFilter = {
      ...saved,
      payment: {
        ...saved.payment,
        selectedcheck: this.selectedcheck,
      },
    };
    this.statesService.saveFilter(newFilter);

    this.closet(event);
  }
}
