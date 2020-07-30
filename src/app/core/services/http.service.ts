import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment';
import { UserModel } from './../models/user.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  public buildUrl(url: string) {
    this.url = environment.api_url + url;
    return this;
  }

  public getPresentation(email: any): Observable<any> {
    return this.http.post<any>(this.url, email)
  }

  
}
