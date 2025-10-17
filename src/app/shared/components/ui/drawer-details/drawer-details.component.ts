import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapCheck, bootstrapX } from '@ng-icons/bootstrap-icons';
import { Tx } from '@core/models/tables.models';
import { formatDateTime } from '@core/functions/formatDate.functions';
import { toCOP } from '@core/functions';
import { CopPipe } from '@shared/pipes/cop.pipe';

@Component({
  selector: 'b-drawer-details',
  standalone: true,
  imports: [CommonModule, DrawerModule, FormsModule, ReactiveFormsModule, NgIcon, CopPipe],
  templateUrl: './drawer-details.component.html',
  styleUrl: './drawer-details.component.scss',
  viewProviders: [provideIcons({ bootstrapCheck, bootstrapX })],
})
export class DrawerDetailsComponent {
  visible = input.required<boolean>();
  params = input.required<Tx>();
  isVisible: boolean = false;

  visibleChange = output<boolean>()

  close(event: boolean) {
    this.visibleChange.emit(event);
  }

  constructor() {
    effect(() => {
      this.isVisible = this.visible();
    });
  }

  setToCOP(value: number): string {
    return toCOP(value);
  }

  setFormatDateTime(value: string): string {
    return formatDateTime(value);
  }
}
