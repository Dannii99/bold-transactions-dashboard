import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Base {
  // Observable para cancelar todas las peticiones pendientes
  public ngUnsubscribe = new Subject<void>();
  ngUnsubscribe$ = this.ngUnsubscribe.asObservable();

  private http = inject(HttpClient);

  cancelAllHttpRequest() {
    this.ngUnsubscribe.next();
  }

  protected _get<T>(url: string, params?: HttpParams | Record<string, string>): Observable<T> {
    return this.http.get<T>(`${url}`, { params }).pipe(
      tap((response: T) => {}),
      takeUntil(this.ngUnsubscribe),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

}
