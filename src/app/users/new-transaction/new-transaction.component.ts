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
  public transactionType: string = 'expense';

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
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
        '1'
      ],
      dayDue: [
        'Today',
        [
          Validators.required
        ]
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


  send(): void {
    if (this.transactionBtnStatus !== '')
      return

    this.transactionSent = true;

    if (this.transactionForm.invalid) {
      this.setBtn('error');
      return;
    }

    this.setBtn('loading');

    const body = {
      type: this.transactionType,
      title: this.transactionForm.get('title').value,
      recurrence: this.transactionForm.get('recurrence').value,
      instalments: this.transactionForm.get('instalments').value,
      dayDue: 0,
      price: this.transactionForm.get('price').value
    }

    console.log(body)

    this.httpService.buildUrl('contracts')
    .post(body)
    .subscribe(
      (transaction) => {
        console.log(transaction)
        this.setBtn('ok');
      }, (error: HttpErrorResponse) => {
        this.setBtn('error');
        console.log(error);
      }
    )
  }
}
