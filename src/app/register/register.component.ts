import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/core/models/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
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
export class RegisterComponent implements OnInit {
  public env = environment;
  public currentStep: string = 'email';

  private registerForm: FormGroup;
  private registerSent: boolean = false;
  private emailErrorMsg: string;
  private nameAnimateShake: boolean = false;
  private emailAnimateShake: boolean = false;
  public nextBtnStatus: string = '';
  public doneBtnStatus: string = '';

  private passwordForm: FormGroup;
  private passwordSent: boolean = false;
  private confirmErrorMsg: string;
  private passwordAnimateShake: boolean = false;
  private confirmAnimateShake: boolean = false;

  @ViewChild('inputName') inputName:ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250)
        ]
      ],
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
          Validators.maxLength(6),
          Validators.pattern("^[0-9]*$")
        ]
      ],
      confirm: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern("^[0-9]*$")
        ]
      ]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputName.nativeElement.focus());
  }

  setBtn(target: string, status: string) {
    const tgt = target + 'BtnStatus';

    if (this[tgt] === undefined)
      return

    switch (status) {
      case '':
        this[tgt] = status;
        break;
      case 'loading':
        this[tgt] = status;
        break;
      case 'error':
        this[tgt] = 'feedback-error';
        setTimeout(() => {
          this.setBtn(target, '');
        }, 1000);
        break;
      case 'ok':
        this[tgt] = 'feedback-ok';
        setTimeout(() => {
          this.setBtn(target, '');
        }, 1000);
        break;
      default:
        console.error('Invalid argument for setBtn()');
    }
  }

  validateRegister() {
    this.registerSent = true;
    this.setBtn('next', 'loading');

    if (this.registerForm.invalid){
      this.setBtn('next', 'error');
      return;
    }

    this.httpService.buildUrl('users/presentation')
    .post(this.registerForm.value)
    .subscribe(
      res => {
        this.emailErrorMsg = 'Email already registered!';
        this.applyShakeAnimation('email');
        this.setBtn('next', 'error');
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.setBtn('next', 'ok');
          setTimeout(() => {
            this.currentStep = 'password';
          }, 1000);
        }
      }
    )
  }

  register() {
    this.passwordSent = true;
    this.setBtn('done', 'loading');

    if (this.passwordForm.invalid) {
      this.setBtn('done', 'error');
      return;
    }

    if (this.passwordForm.get('password').value !== this.passwordForm.get('confirm').value) {
      this.applyShakeAnimation('confirm');
      this.confirmErrorMsg = 'Passwords don\'t macth!';
      this.setBtn('done', 'error');
      return;
    }

    const body = {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      password: this.passwordForm.get('password').value
    }

    this.httpService.buildUrl('users').post(body)
    .subscribe(
      (data: UserModel) => {
        this.setBtn('done', 'ok');
        setTimeout(() => {
          this.httpService.createLocalUser(data);
          this.router.navigate(['dashboard']);
        }, 1000);
      }, (error: HttpErrorResponse) => {
        this.setBtn('done', 'error');

        this.passwordForm.get('password').setValue('');
        this.passwordForm.get('confirm').setValue('');
      }
    )
  }

  applyShakeAnimation(target: string): void {
    const tgt = target + 'AnimateShake';

    if (this[tgt] === undefined)
      return;

    this[tgt] = true;

    setTimeout(() => {
      if (this[tgt]) this[tgt] = false;
    }, 800);
  }

  onPasswordChange(field: string, val: string): void {
    let password = this.passwordForm.get(field).value;

    if (password.match(/\D/g)) {
      this.applyShakeAnimation(field);
      password = password.replace(/\D/g, '');

      this.passwordForm.get(field).setValue(password);
    } else if (password.length > 6) {
      this.applyShakeAnimation(field);
      password = password.substring(0, 6);

      this.passwordForm.get(field).setValue(password);
    }
  }
}
