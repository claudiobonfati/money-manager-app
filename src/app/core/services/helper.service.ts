import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public is_mobile: boolean   = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
  public is_android: boolean  = (/Android|BlackBerry/).test(navigator.userAgent);

  constructor(
    private titleService: Title,
  ) { }

  public isMobile(): boolean {
    return this.is_mobile;
  }

  public isAndroid(): boolean {
    return this.is_android;
  }

  public setTitle(title?: string): void {
      this.titleService.setTitle(environment.name + ' | ' + title);
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public cloneObject(obj: object): any {
    const copy = JSON.parse(JSON.stringify(obj));
    return copy;
  }

  public shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}