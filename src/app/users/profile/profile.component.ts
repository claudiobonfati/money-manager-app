import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';
import { ProfileModel } from 'src/app/core/models/profile.model';

import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }

  constructor(
    private formBuilder: FormBuilder,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.httpService.getUser();

    this.pondFiles = [
      `${this.env.api_url}users/${this.currentUser._id}/avatar`
    ]
    // Initiate forms
    this.profileForm = this.formBuilder.group({
      email: [
        "test@test.com", 
        [
          Validators.required, 
          Validators.email
        ]
      ],
      birthday: [
        "28/14/1997", 
        [
          Validators.required
        ]
      ],
      currency: [
        "US$", 
        [
          Validators.required
        ]
      ]
    });
  }

}
