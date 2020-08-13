import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private httpService: HttpService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.httpService.getToken()}`
      }
    })

    return next.handle(request);
  }
}
