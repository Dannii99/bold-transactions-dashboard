import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapInfoCircle } from '@ng-icons/bootstrap-icons';
import { saxSetting4Outline } from '@ng-icons/iconsax/outline';
import { ionClose } from '@ng-icons/ionicons';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    NgIcon,
    SelectButtonModule,
    ToggleButtonModule,
    PopoverModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  viewProviders: [provideIcons({ bootstrapInfoCircle, saxSetting4Outline, ionClose })],
})
export class Dashboard {

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
     const target = event.target as HTMLElement;

    // Si el click NO es dentro de un elemento con la clase 'toggle-filter'
    if (!target.closest('.toggle-filter-containt')) {
      this.isOpen.set(false);
    }
  }

  stateOptions: any[] = [
    { label: 'Hoy', value: 1 },
    { label: 'Esta semana', value: 2 },
    { label: 'Junio', value: 3 },
  ];

  value: number = 1;
  // componente.ts
  isOpen = signal(false);

  selectedCategories: any[] = [];

  categories: any[] = [
    { name: 'Cobro con datafono', key: 1 },
    { name: 'Cobro con link de pago', key: 2 },
    { name: 'Ver todos', key: 3 },
  ];

  ngOnInit() {
    this.selectedCategories = [this.categories[1]];
  }

  closet() {
    this.isOpen.set(false);
    console.log('closet: ',this.isOpen());

  }

  append() {
    this.isOpen.set(true);
    console.log('append: ',this.isOpen());
  }

  toggle() {
   this.isOpen.update(value => !value);
    console.log('toggle: ',this.isOpen());
  }


}
