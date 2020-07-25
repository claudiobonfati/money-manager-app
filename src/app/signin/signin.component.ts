import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/core/helper.service';
import { trigger, style, animate, transition } from '@angular/animations';

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
  public registerSent = false;
  public passwordSent = false;
  public registerForm: FormGroup;
  public passwordForm: FormGroup;
  public registerVisible = true;
  public passwordVisible = false;
  public password = [];
  public passButtons = [];

  // @ViewChild('inputEmail') inputEmail:ElementRef;

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
  }

  ngAfterViewInit() {
    // setTimeout(() => this.inputEmail.nativeElement.focus());
  }

  get registerField() {
    return this.registerForm.controls;
  }

  get passwordField() {
    return this.passwordForm.controls;
  }

  passAdd(value1, value2) {
    let key = [value1, value2]
    this.password.push(key)

    let currValue = this.passwordForm.get('password').value;
    this.passwordForm.get('password').setValue(currValue + "0");

    console.log(this.password)
  }

  passRemove() {
    this.password.pop()
    let currValue = this.passwordForm.get('password').value;
    let newValue = currValue.substring(0, currValue.length - 1);

    this.passwordForm.get('password').setValue(newValue);
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
