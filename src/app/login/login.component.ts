import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/services/helper.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/core/models/user.model'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
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
export class LoginComponent implements OnInit {
  public env = environment;
  public currentUser: any;
  public currentStep: string = '';
  public loginMode: string = '';

  public emailForm: FormGroup;
  public emailSent: boolean = false;
  public emailErrorMsg: string;
  public emailAnimateShake: boolean = false;

  public passwordForm: FormGroup;
  public passwordSent: boolean = false;
  public passwordAnimateShake: boolean = false;
  public passButtons: Array<any> = [];
  private password: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private httpService: HttpService,
    private router: Router
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
    let _id = localStorage.getItem('loginEasyId');
    let name = localStorage.getItem('loginEasyName');
    
    if (_id && name) {
      _id = atob(_id);
      name = atob(name);
      this.loginMode = 'easy';
      this.currentStep = 'password';
      this.currentUser = { _id, name };
    } else {
      this.loginMode = 'normal';
      this.currentStep = 'email';
    }
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
    .post(this.emailForm.value)
    .subscribe(
      (res) => {
        this.currentUser = res;
        this.currentStep = 'password';
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.emailErrorMsg = 'Email not registered!';
          this.applyShakeAnimation('email');
        }
      }
    )
  }

  removeCurrentUser(): void {
    this.httpService.clearLoginEasy();
    this.loginMode = 'normal';
    this.currentStep = 'email';
    this.currentUser = null;
    this.passwordSent = false;
    this.emailSent = false;
    this.emailForm.get('email').setValue('');
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
      .post({ email, password })
      .subscribe(
        (data: UserModel) => {
          this.httpService.createLocalUser(data);
          this.router.navigate(['dashboard']);
        }, (error: HttpErrorResponse) => {
          if(error.status === 400)
            this.applyShakeAnimation('password');
        }  
      )
    } else {
      const id = atob(localStorage.getItem('loginEasyId'));
      const password = this.password;

      this.httpService.buildUrl('users/loginEasy')
      .post({ _id: id, password })
      .subscribe(
        (data: UserModel) => {
          this.httpService.createLocalUser(data);
          this.router.navigate(['./dashboard']);
        }, (error: HttpErrorResponse) => {
          if(error.status === 400)
            this.applyShakeAnimation('password');
        }
      )
    }
  }
}
