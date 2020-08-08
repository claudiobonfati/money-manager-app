import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment';
import { UserModel } from './../models/user.model';
import { ProfileModel } from './../models/profile.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'; 


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public currentUser: ProfileModel;
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
    localStorage.setItem('token', btoa(data.token));
    localStorage.setItem('user', btoa(JSON.stringify(data.user)));
    this.currentUser = data.user;
    
    this.storeLoginEasy(data);
  }

  public getUser(): any {
    return JSON.parse(atob(localStorage.getItem('user')));
  }

  public storeLoginEasy(data: UserModel): void {
    localStorage.setItem('loginEasyId', btoa(data.user._id));
    localStorage.setItem('loginEasyName', btoa(data.user.name));
  }

  public clearLoginEasy(): void {
    localStorage.removeItem('loginEasyId');
    localStorage.removeItem('loginEasyName');
  }

  public buildUrl(url: string) {
    this.url = environment.api_url + url;
    return this;
  }

  public post(body: object): Observable<any> {
    return this.http.post<object>(this.url, body);
  }

  public get(): Observable<any> {
    return this.http.get(this.url);
  }

  public logout(): any {
    this.buildUrl('/users/logout');
    this.clearLocalUserData();

    // return this.http.post<any>(this.url);
    // console.log('set htto request')
    this.router.navigate(['/'])
  }

  public getToken(): string {
    return atob(localStorage.getItem('token'));
  }

  private clearLocalUserData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');  
  }
}
