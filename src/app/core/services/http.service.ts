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

  public checkAuth(): boolean {
    let user = localStorage.getItem('user');

    if (user) {
      return true;
    } else { 
      return false;
    }
  }

  public storeUser(data: UserModel): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', btoa(JSON.stringify(data.user)));
    localStorage.setItem('loginEasyId', btoa(JSON.stringify(data.user._id)));
  }

  public buildUrl(url: string) {
    this.url = environment.api_url + url;
    return this;
  }

  public getPresentation(email: object): Observable<any> {
    return this.http.post<object>(this.url, email);
  }

  public login(email: string, password: string): Observable<any> {
    let content = {
      email,
      password
    }

    return this.http.post<any>(this.url, content);
  }

  public loginEasy(_id: string, email: string, password: Array<any>): Observable<any> {
    let content = {
      _id,
      email,
      password
    }

    return this.http.post<any>(this.url, content);
  }
}
