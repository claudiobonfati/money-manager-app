import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

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

  public registerForm: FormGroup;
  public registerSent: boolean = false;
  public emailErrorMsg: string;
  public nameAnimateShake: boolean = false;
  public emailAnimateShake: boolean = false;

  public passwordForm: FormGroup;
  public passwordSent: boolean = false;
  public confirmErrorMsg: string;
  public confirmAnimateShake: boolean = false;

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

  validateRegister() {
    this.registerSent = true;

    if (this.registerForm.invalid)
      return

    this.httpService.buildUrl('users/presentation')
    .post(this.registerForm.value)
    .subscribe(
      res => {
        this.emailErrorMsg = 'Email already registered!';
        this.applyShakeAnimation('email');
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.currentStep = 'password';
        }
      }
    )
  }

  register() {
    this.passwordSent = true;

    if (this.passwordForm.invalid)
      return
    
    if (this.passwordForm.get('password').value !== this.passwordForm.get('confirm').value) {
      this.applyShakeAnimation('confirm');
      this.confirmErrorMsg = 'Passwords don\'t macth!';
      return;
    }

    const body = {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      password: this.passwordForm.get('password').value
    }

    this.httpService.buildUrl('users').post(body)
    .subscribe(
      data => {
        this.httpService.storeUser(data);
        this.router.navigate(['dashboard']);
      }, (error: HttpErrorResponse) => {
        console.log(error)
        this.passwordForm.get('password').setValue('');
        this.passwordForm.get('confirm').setValue('');
      }
    )   
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
}
