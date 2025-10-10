import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  @Input() title: String = 'Filtrar';
  @Input() checkFilter: any[] = [];
  Selectedcheck: any[] = [];
  isOpen = signal(false);

  @Output() filterChange = new EventEmitter();

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Si el click NO es dentro de un elemento con la clase 'toggle-filter'
    if (!target.closest('.toggle-filter-containt')) {
      this.isOpen.set(false);
    }
  }

  // - payment method ________________________________

  onCheckChange(item: any) {
    const isAll = item.key === 'TODOS';
    const allItem = this.checkFilter.find((i) => i.key === 'TODOS');

    if (isAll) {
      const checked = this.Selectedcheck.some((c) => c.key === 'TODOS');
      if (checked) {
        // Marcar todos los demás y deshabilitarlos
        this.Selectedcheck = [...this.checkFilter];
        this.checkFilter.forEach((i) => {
          if (i.key !== 'TODOS') i.disabled = true;
        });
      } else {
        // Desmarcar todos y habilitarlos
        this.Selectedcheck = [];
        this.checkFilter.forEach((i) => (i.disabled = false));
      }
    } else {
      // Si marca/desmarca otro, controlar "Ver todos"
      const othersChecked = this.Selectedcheck.filter((i) => i.key !== 'TODOS').length;
      if (othersChecked !== this.checkFilter.length - 1) {
        // Hay alguno sin marcar → desmarcar "Ver todos"
        allItem && (this.Selectedcheck = this.Selectedcheck.filter((i) => i.key !== 'TODOS'));
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
    this.filterChange.emit(this.Selectedcheck);
    this.closet(event);
  }
}
