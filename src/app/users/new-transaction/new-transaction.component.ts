import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper.service';
import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.sass']
})
export class NewTransactionComponent implements OnInit {
  public transactionForm: FormGroup;
  public transactionSent: boolean = false;
  public transactionBtnStatus: string = '';
  private transactionType: string = 'expense';
  public titleAnimateShake: boolean = false;
  public recurrenceAnimateShake: boolean = false;
  public instalmentsAnimateShake: boolean = false;
  public dayDueAnimateShake: boolean = false;
  public priceAnimateShake: boolean = false;
  private todayDate: string;

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    // Get current date
    let today = new Date();
    let d = today.getDate();
    let m: any = today.getMonth() + 1;
    m = (m < 10) ? '0'+m : m;
    let y = today.getFullYear();

    this.todayDate = `${y}-${m}-${d}`;

    // Initiate form
    this.transactionForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required
        ]
      ],
      recurrence: [
        'once',
        [
          Validators.required
        ]
      ],
      instalments: [
        '',
        [
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(2)
        ]
      ],
      dayDueMonth: [
        this.todayDate,
        [
          Validators.required
        ]
      ],
      dayDue: [
        '1',
      ],
      price: [
        '',
        [
          Validators.required
        ]
      ],
    });
  }

  setTapPosition(target: string): void {
    if (target !== 'expense' && target !== 'income')
      return

    this.transactionType = target;
  }

  getTabClass(): string {
    return 'step-' + this.transactionType;
  }

  getTransactionDueDayType(): string {
    if (this.helperService.isMobile()) {
      return 'date';
    } else {
      return 'text';
    }
  }

  onRecurrenceChange(): void {
    let recurrence = this.transactionForm.get('recurrence').value;

    if (recurrence === 'weekly' || recurrence === 'every_two_weeks') {
      this.transactionForm.get('dayDue').setValue('1');
    } else {
      this.transactionForm.get('dayDue').setValue(this.todayDate);
    }
  }

  onInstalmentsChange(): void {
    let limit = 999;
    let instalments = this.transactionForm.get('instalments').value;

    if (instalments > limit) {
      this.applyShakeAnimation(instalments);
      this.transactionForm.get('instalments').setValue(limit);
    } else if (instalments < 1) {
      this.applyShakeAnimation(instalments);
      this.transactionForm.get('instalments').setValue(1);
    }
  }

  priceAdd(value: number): void {
    let current = this.transactionForm.get('price').value;
    let result = parseInt(current) + value;

    if (isNaN(result)) {
      result = value;
    } else {
      result = current + value;
    }

    if (result < 0)
      result = 0;

    this.transactionForm.controls['price'].setValue(result);
  }

  setBtn(status: string) {
    switch (status) {
      case '':
        this.transactionBtnStatus = status;
        break;
      case 'loading':
        this.transactionBtnStatus = status;
        break;
      case 'error':
        this.transactionBtnStatus = 'feedback-error';
        setTimeout(() => {
          this.setBtn('');
        }, 1000);
        break;
      case 'ok':
        this.transactionBtnStatus = 'feedback-ok';
        setTimeout(() => {
          this.setBtn('');
        }, 1000);
        break;
      default:
        console.error('Invalid argument for setBtn()');
    }
  }

  applyShakeAnimation(target: string): void {
    const tgt = target + 'AnimateShake';

    if (this[tgt] === undefined)
      return;

    this[tgt] = true;

    setTimeout(() => {
      if (this[tgt]) this[tgt] = false;
    }, 800)
  }

  send(): void {
    if (this.transactionBtnStatus !== '')
      return

    this.transactionSent = true;

    if (this.transactionForm.invalid) {
      if (this.transactionForm.get('title').status === "INVALID")
        this.applyShakeAnimation('title');
      if (this.transactionForm.get('recurrence').status === "INVALID")
        this.applyShakeAnimation('recurrence');
      if (this.transactionForm.get('price').status === "INVALID")
        this.applyShakeAnimation('price');

      this.setBtn('error');
      return;
    }

    if (this.transactionForm.get('recurrence').value === 'weekly' ||
        this.transactionForm.get('recurrence').value === 'every_two_weeks') {
      if (!this.transactionForm.get('instalments').value ||
          this.transactionForm.get('instalments').value < 2) {
        this.applyShakeAnimation('instalments');
        this.setBtn('error');
        return;
      }
    }

    if (this.transactionForm.get('price').value === 0) {
      this.applyShakeAnimation('price');
      this.setBtn('error');
      return;
    }

    this.setBtn('loading');

    const body = {
      type: this.transactionType,
      title: this.transactionForm.get('title').value,
      recurrence: this.transactionForm.get('recurrence').value,
      instalments: (this.transactionForm.get('recurrence').value === 'once' ? 1 : this.transactionForm.get('instalments').value),
      dayDue: 0,
      price: this.transactionForm.get('price').value
    }

    if (this.transactionForm.get('recurrence').value === 'weekly' ||
        this.transactionForm.get('recurrence').value === 'every_two_weeks') {
      body.dayDue = this.transactionForm.get('dayDue').value;
    } else if (this.transactionForm.get('recurrence').value === 'once' ||
        this.transactionForm.get('recurrence').value === 'monthly') {
      let dayDueInput = new Date(this.transactionForm.get('dayDueMonth').value);
      let day = dayDueInput.getDate();
      body.dayDue = day + 1;
    }

    this.httpService.buildUrl('contracts')
    .post(body)
    .subscribe(
      (transaction) => {
        setTimeout(() => {
          this.setBtn('ok');
          this.transactionForm.reset();
          this.transactionForm.patchValue({
            recurrence: 'once',
            price: '',
            dayDue: this.todayDate
          });
        }, 1000)
      }, (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {
          this.setBtn('error');
        }, 1000)
      }
    )
  }
}
