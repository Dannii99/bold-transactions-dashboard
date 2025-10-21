import { CommonModule } from '@angular/common';
import { Component, effect, input, InputSignal } from '@angular/core';
import { Method } from '@core/models/tables.models';

enum methodTypes {
  Bancolombia = 'bancolombia',
  Daviplata = 'daviplata',
  Nequi = 'nequi',
  Pse = 'pse',
  Visa = 'VISA',
  Mastercard = 'MASTERCARD',
}

@Component({
  selector: 'b-tag-payments',
  imports: [CommonModule],
  templateUrl: './tag-payments.html',
  styleUrl: './tag-payments.scss',
})
export class TagPayments {
  method: InputSignal<Method> = input.required<Method>();

  iconMethod(method: string, franchise?: string): string {
    let methodSwitch: string = method;
    let icon: string = '';
    if (franchise) {
      methodSwitch = franchise;
    }

    switch (methodSwitch) {
      case methodTypes.Bancolombia:
        icon = 'images/paymenst/bancolombia.png';
        break;
      case methodTypes.Nequi:
        icon = 'images/paymenst/nequi.png';
        break;
      case methodTypes.Daviplata:
        icon = 'images/paymenst/daviplata.png';
        break;
      case methodTypes.Pse:
        icon = 'images/paymenst/pse.png';
        break;
      case methodTypes.Visa:
        icon = 'images/paymenst/visa.png';
        break;
      case methodTypes.Mastercard:
        icon = 'images/paymenst/mastercard.png';
        break;

      default:
        icon = '';
        break;
    }

    return icon;
  }
}
