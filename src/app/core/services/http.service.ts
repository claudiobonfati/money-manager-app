import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment';
import { UserModel } from './../models/user.model';
import { ProfileModel } from './../models/profile.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'; 
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public currentUser: ProfileModel;
  private url: string;
  public test: string;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  public checkAuth(): boolean {
    let user = localStorage.getItem('currentUser');

    return user ? true : false;
  }

  public createLocalUser(data: UserModel): void {
    this.saveLocalUser(data.user)

    if (data.token)
      localStorage.setItem('token', btoa(data.token));
  }

  public saveLocalUser(user: ProfileModel): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', btoa(JSON.stringify(user)));
    localStorage.setItem('loginEasyId', btoa(user._id));
    localStorage.setItem('loginEasyName', btoa(user.name));
  }

  public getLocalUser(): ProfileModel {
    let userData = this.currentUser ? this.currentUser : JSON.parse(atob(localStorage.getItem('currentUser')));

    if (userData) {
      return userData;
    } else {
      this.logout();
    }
  }

  public clearLoginEasy(): void {
    localStorage.removeItem('loginEasyId');
    localStorage.removeItem('loginEasyName');
  }

  private clearLocalUserData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');  
  }

  public logout(): any {
    this.buildUrl('/users/logout');
    this.clearLocalUserData();

    // return this.http.post<any>(this.url);
    this.router.navigate(['/'])
  }

  public getToken(): string {
    return atob(localStorage.getItem('token'));
  }

  public buildUrl(url: string) {
    this.url = environment.api_url + url;
    return this;
  }

  public get(): Observable<any> {
    return this.http.get(this.url);
  }

  public post(body: object): Observable<any> {
    return this.http.post<object>(this.url, body);
  }

  public patch(body: object): Observable<any> {
    return this.http.patch<object>(this.url, body);
  }
}
