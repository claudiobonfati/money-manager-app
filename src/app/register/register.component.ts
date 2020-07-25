import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/helper.service';
import { trigger, style, animate, transition } from '@angular/animations';

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
  public registerSent = false;
  public passwordSent = false;
  public registerForm: FormGroup;
  public passwordForm: FormGroup;
  public registerVisible = true;
  public passwordVisible = false;

  @ViewChild('inputName') inputName:ElementRef;

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService
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
          Validators.minLength(3),
          Validators.maxLength(250)
        ]
      ],
      confirm: [
        "", 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250)
        ]
      ]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputName.nativeElement.focus());
  }

  get registerField() {
    return this.registerForm.controls;
  }

  get passwordField() {
    return this.passwordForm.controls;
  }

  storeInfo() {
    this.registerSent = true;

    this.registerVisible = false;
    setTimeout(() => {
      this.passwordVisible = true;
    }, 300)
  }

  send() {
    this.passwordSent = true;
    console.log('sent')
  }
}
