import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, takeUntil, throwError } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Interceptors {

  private cancelRequests = new Subject<void>();

  private requests: HttpRequest<unknown>[] = [];

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.requests.push(req);

    let headers = req.headers;
    headers = new HttpHeaders();

    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest).pipe(
      takeUntil(this.cancelRequests),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  // Método para cancelar las peticiones
  cancelAllRequests() {
    this.cancelRequests.next();
  }
}
