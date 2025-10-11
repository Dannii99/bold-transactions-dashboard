import { inject, Injectable } from '@angular/core';
import { ApiResponse, ApiTx, Method, Tx } from '@core/models/tables.models';
import { Base } from '@core/services/base';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends Base {
  getTransactions(): Observable<Tx[]> {
    const url = 'api';
    if (!url) {
      throw new Error('URL no está definida');
    }

    return this._get<ApiResponse>(url).pipe(
      map((response: ApiResponse) => this.transformTransactions(response.data)),
      catchError((error) => {
        console.error('Error fetching transactions:', error);
        throw error;
      })
    );
  }


  private transformTransactions(data: ApiTx[]): Tx[] {
    // Verifica si data es un array
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return [];
    }

    return data.map((item: ApiTx) => ({
      status: item.status === 'SUCCESSFUL' ? 'success' : 'failed',
      date: new Date(item.createdAt).toISOString(),
      method: {
        brand: this.mapPaymentMethod(item.paymentMethod),
        last4: item.paymentMethod.includes('CARD')
          ? String(item.transactionReference).slice(-4)
          : undefined,
        },
      salesType: item.salesType,
      boldId: item.id,
      amount: item.amount,
      deductions:
        item.salesType === 'PAYMENT_LINK'
          ? [{ label: 'Deducción Bold', value: item.amount * 0.03 }]
          : [],
    }));
  }

  // Método auxiliar para mapear payment methods
  private mapPaymentMethod(method: string): any {
    const methodLower = method.toLowerCase();
    return methodLower;
  }
}
