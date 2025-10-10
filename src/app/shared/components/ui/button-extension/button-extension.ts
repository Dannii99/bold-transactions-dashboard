import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
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
  viewProviders: [provideIcons({saxSetting4Outline, ionClose})],
})
export class ButtonExtension {
  @Input() title: String = 'Filtrar';
  @Input() checkFilter: any[] = [];
  Selectedcheck: any[] = [];
  isOpen = signal(false);

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Si el click NO es dentro de un elemento con la clase 'toggle-filter'
    if (!target.closest('.toggle-filter-containt')) {
      this.isOpen.set(false);
    }
  }

  // - filter ________________________________
  ngOnInit() {
    this.Selectedcheck = [this.checkFilter[1]];
  }

  closet(event: Event) {
    event.stopPropagation();
    this.isOpen.set(false);
    console.log('closet: ', this.isOpen());
  }

  append() {
    this.isOpen.set(true);
    console.log('append: ', this.isOpen());
  }

  toggle() {
    this.isOpen.update((value) => !value);
    console.log('toggle: ', this.isOpen());
  }
}
