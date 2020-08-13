import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';
import { ProfileModel } from 'src/app/core/models/profile.model';
import { HelperService } from 'src/app/core/services/helper.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  public env = environment;
  public currentUser: ProfileModel;
  public profileForm: FormGroup;
  public profileSent: boolean = false;
  public birthdayAnimateShake: boolean = false;
  public currencyAnimateShake: boolean = false;

  @ViewChild('myPond') myPond: any;

  pondOptions = {
    imagePreviewHeight: 170,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    stylePanelLayout: 'compact circle',
    styleLoadIndicatorPosition: 'center bottom',
    styleProgressIndicatorPosition: 'right bottom',
    styleButtonRemoveItemPosition: 'left bottom',
    styleButtonProcessItemPosition: 'right bottom'
  }

  pondFiles = [
    'assets/images/mascot.svg'
  ]

  pondHandleInit() {
    // console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    // console.log('A file was added', event);
  }

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService,
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.httpService.getLocalUser();

    if (this.currentUser.avatar)
      this.pondFiles = [ this.env.api_url + this.currentUser.avatar ];

    let birthday: string;
    if (this.currentUser.birthday) {
      birthday = new Date(this.currentUser.birthday).toISOString().substr(0,10);
    }

    // Initiate forms
    this.profileForm = this.formBuilder.group({
      name: [
        this.currentUser.name,
        [
          Validators.required
        ]
      ],
      email: [
        {
          value: this.currentUser.email,
          disabled: true
        },
        [
          Validators.required, 
          Validators.email
        ]
      ],
      birthday: [
        birthday, 
        [
          Validators.required
        ]
      ]
    });
  }

  getBirthdayInputType(): string {
    if (this.helperService.isMobile()) {
      return 'date';
    } else if (this.currentUser.birthday) {
      return 'date';
    } else {
      return 'text';
    }
  }

  update() {
    this.profileSent = true;

    if (this.profileForm.invalid)
      return

    const body = {
      name: this.profileForm.get('name').value,
      birthday: this.profileForm.get('birthday').value
    }

    this.httpService.buildUrl('users/me')
    .patch(body)
    .subscribe(
      (user: ProfileModel) => {
        this.httpService.saveLocalUser(user);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }
}
