import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { environment as env } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class Base {

  // Observable para cancelar todas las peticiones pendientes
	public ngUnsubscribe = new Subject<void>();
	ngUnsubscribe$ = this.ngUnsubscribe.asObservable();

  private http = inject(HttpClient);

  protected baseUrl = env.url;

  cancelAllHttpRequest() {
    this.ngUnsubscribe.next();
  }

  protected _get<T>(url: string, params: any = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: params }).pipe(
      tap((response: any) => {}),
      takeUntil(this.ngUnsubscribe),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    )
  }


}
