import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private key = 'filter';

  saveFilter(values: any) {
    localStorage.setItem(this.key, JSON.stringify(values));
  }

  loadFilter(): any {
    const saved = localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : {};
  }

  clearFilter() {
    localStorage.removeItem(this.key);
  }
}
