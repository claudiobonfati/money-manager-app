import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass'],
  animations: [
    trigger('panelInOut', [
      transition('void => *', [
        style({transform: 'translateX(+25px)', opacity: 0, position: 'absolute', top: 0 }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(-25px)', opacity: 0, position: 'absolute', top: 0 }))
      ])
    ])
  ]
})
export class SigninComponent implements OnInit {
  public env = environment;
  public currentStep = '';
  public emailSent = false;
  public passwordSent = false;
  public emailForm: FormGroup;
  public passwordForm: FormGroup;
  public password = [];
  public passButtons = [];
  public currentUser = null;

  // @ViewChild('inputEmail') inputEmail:ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: [
        "", 
        [
          Validators.required, 
          Validators.email
        ]
      ]
    });

    this.passwordForm = this.formBuilder.group({
      password: [
        "", 
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ]
      ]
    });

    let numbers = [0,1,2,3,4,5,6,7,8,9];
    this.helperService.shuffleArray(numbers);

    this.passButtons = [
      {
        opt1: numbers[0],
        opt2: numbers[1],
      },{
        opt1: numbers[2],
        opt2: numbers[3],
      },{
        opt1: numbers[4],
        opt2: numbers[5],
      },{
        opt1: numbers[6],
        opt2: numbers[7],
      },{
        opt1: numbers[8],
        opt2: numbers[9],
      }
    ];

    let user = localStorage.getItem('currentUserPresentation');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.currentStep = 'password';
    } else {
      this.currentStep = 'email';
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => this.inputEmail.nativeElement.focus());
  }

  get emailField() {
    return this.emailForm.controls;
  }

  get passwordField() {
    return this.passwordForm.controls;
  }

  passAdd(value1, value2) {
    let key = [value1, value2];
    this.password.push(key);

    let currValue = this.passwordForm.get('password').value;
    this.passwordForm.get('password').setValue(currValue + "0");
  }

  passRemove() {
    this.password.pop();

    let currValue = this.passwordForm.get('password').value;
    let newValue = currValue.substring(0, currValue.length - 1);
    this.passwordForm.get('password').setValue(newValue);
  }

  getPresentation(): void {
    this.emailSent = true;

    this.httpService.buildUrl('users/presentation')
    .getPresentation(this.emailForm.value).subscribe(
      res => {
        localStorage.setItem('currentUserPresentation', JSON.stringify(res));
        this.currentUser = res;
        this.currentStep = 'password';
      }, error => {
        console.log(error)
      }
    )
  }

  removeCurrentUser(): void {
    localStorage.clear();

    this.currentStep = 'email'
    this.emailForm.get('email').setValue("");
    this.currentUser = null;
  }

  login(): void {
    
  }
}
