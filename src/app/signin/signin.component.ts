import { Component, OnInit } from '@angular/core';
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
  public currentUser = null;
  public currentStep = '';
  public loginMode = '';

  public emailForm: FormGroup;
  public emailSent = false;
  public emailErrorMsg = null;
  public emailAnimateShake = false;

  public passwordForm: FormGroup;
  public passwordSent = false;
  public passwordAnimateShake = false;
  public passButtons = [];
  public password = [];

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    // Initiate forms
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

    // Generate random buttons for easy login
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

    // Set login type
    let id = localStorage.getItem('loginEasyId');
    this.loginMode = id ? 'easy' : 'normal';
    
    // Set current step
    let user = localStorage.getItem('currentUserPresentation');
    this.currentUser = user ? JSON.parse(user) : null;
    this.currentStep = user ? 'password' : 'email';
  }

  ngAfterViewInit() {

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

    if (this.emailForm.invalid){
      if (this.emailForm.controls.email.errors.required) {
        this.emailErrorMsg = 'Please type your email!';
      } else if (this.emailForm.controls.email.errors.email) {
        this.emailErrorMsg = 'Invalid email!';
      }

      this.applyShakeAnimation('email');
      return;
    }

    this.httpService.buildUrl('users/presentation')
    .getPresentation(this.emailForm.value)
    .subscribe(
      res => {
        // Add logic here
        // this.currentUser = res;
        // this.currentStep = 'password';
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.emailErrorMsg = 'Email not registered!';
          this.applyShakeAnimation('email');
        }
      }
    )
  }

  removeCurrentUser(): void {
    localStorage.clear();
    this.passwordSent = false;
    this.emailSent = false;
    this.emailForm.get('email').setValue("");
    this.currentStep = 'email';
    this.currentUser = null;
  }

  applyShakeAnimation(target: string): void {
    const tgt = target + 'AnimateShake';

    if (this[tgt] === undefined)
      return

    this[tgt] = true;

    setTimeout(() => {
      if (this[tgt]) this[tgt] = false;
    }, 800)
  }

  login(): void {
    this.passwordSent = true;

    if (this.passwordForm.invalid) {
      this.applyShakeAnimation('password');
      return;
    }
    
    if (this.loginMode === 'normal'){
      const email = this.emailForm.controls['email'].value;
      const password = this.passwordForm.controls['password'].value;

      this.httpService.buildUrl('users/login')
      .login(email, password)
      .subscribe(
        res => {
          console.log('res')
          console.log(res)
        }, (error: HttpErrorResponse) => {
          console.log(error);
          if(error.status === 400) {
            this.applyShakeAnimation('password');
          }
        }  
      )
    } else {
      const id = this.currentUser._id;
      const email = this.currentUser.email;
      const password = this.password;

      this.httpService.buildUrl('users/login')
      .loginEasy(id, email, password)
      .subscribe(
        res => {
          console.log('res')
          console.log(res)
        }, error => {
          console.log('error')
          console.log(error)
        }
      )
    }


        // localStorage.setItem('currentUserPresentation', JSON.stringify(res));
  }
}
