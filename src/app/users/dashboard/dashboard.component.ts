import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  public today: Date;
  public active_month: number;
  public current_month: number;
  public active_year: number;
  public current_year: number;
  public active_day: number;
  public current_day: number;
  public month_names: Array<String> = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  public data: any;
  public newUser: boolean = false;
  public loadingData: boolean = true;
  public serverError: boolean = false;

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.today = new Date();

    this.current_year = this.today.getFullYear();
    this.active_year = this.today.getFullYear();

    this.current_month = this.today.getMonth();
    this.active_month = this.today.getMonth();

    this.current_day = this.today.getDate();
    this.active_day = this.today.getDate();

    this.getData();
  }

  getNextMonth(): void {
    if (this.active_month === 11) {
      this.active_year += 1;
      this.active_month = 0;
    } else {
      this.active_month += 1;
    }

    this.getData();
  }

  getPrevMonth(): void {
    if (this.active_month === 0) {
      this.active_year -= 1;
      this.active_month = 11;
    } else {
      this.active_month -= 1;
    }

    this.getData();
  }

  getData(): void {
    if (this.active_year != this.current_year ||
        this.active_month != this.current_month) {
      let month_last_date = new Date(this.active_year, this.active_month + 1, 0)
      this.active_day = month_last_date.getDate();
    } else {
      this.active_day = this.current_day;
    }

    let body = {
      year: this.active_year,
      month: this.active_month,
      day: this.active_day
    };

    this.httpService.buildUrl('dashboard')
    .post(body)
    .subscribe({
      next: data => {
        if (data.newUser){
          this.newUser = true;
          this.loadingData = false;
        } else {
          this.loadingData = false;
          this.serverError = false;
          this.data = data;
          this.calcPercentages(data);
        }
      },
      error: error => {
        this.loadingData = false;
        this.serverError = true;
        this.data = null;
      }
    })
  }

  getOutputMoney(value = 0): String {
    return (value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  calcPercentages(data): void {
    data.incomePercent = 0;
    data.expensePercent = 0;

    if (data.incomeTotal > data.expenseTotal) {
      data.incomePercent = 100;
      data.expensePercent = Math.floor(data.expenseTotal * 100 / data.incomeTotal);
    } else if (data.incomeTotal < data.expenseTotal)  {
      data.expensePercent = 100;

      data.incomePercent = Math.floor(data.incomeTotal * 100 / data.expenseTotal);
    } else if (data.incomeTotal === 0 && data.expenseTotal === 0) {
      data.incomePercent = 0;
      data.expensePercent = 0;
    } else {
      data.incomePercent = 100;
      data.expensePercent = 100;
    }
  }
}
