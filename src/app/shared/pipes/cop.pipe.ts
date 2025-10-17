import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cop',
  standalone: true
})
export class CopPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null) return '—'; // si llega null o undefined

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }

}
