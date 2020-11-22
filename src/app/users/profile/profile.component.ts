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
  private currentUser: ProfileModel;
  public profileForm: FormGroup;
  public profileSent: boolean = false;
  public profileBtnStatus: string = '';
  public nameAnimateShake: boolean = false;
  public birthdayAnimateShake: boolean = false;
  private profileAvatarModified: boolean = false;
  private profileAvatarEvent: any;
  public pondFiles: any = ['assets/images/mascot.svg'];
  public wallet: any = null;

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

  pondHandleAddFile(event: any) {
    this.profileAvatarEvent = event;
    this.profileAvatarModified = (typeof event.file.source === 'string') ? false : true;
  }

  constructor(
    public formBuilder: FormBuilder,
    public httpService: HttpService,
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.httpService.getLocalUser();

    if (this.currentUser.avatar) {
      this.pondFiles = [this.env.api_url + this.currentUser.avatar];
    }

    let birthday: string;
    if (this.currentUser.birthday) {
      birthday = new Date(this.currentUser.birthday).toISOString().substr(0, 10);
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

    this.getWallet();
  }

  getWallet(): void {
    this.httpService.buildUrl('users/me/wallet')
    .get()
    .subscribe({
      next: data => {
        this.wallet = data;
      },
      error: error => {
        this.wallet = null;
      }
    })
  }

  getOutputMoney(value = 0): String {
    return (value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
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

  setBtn(status: string) {
    switch (status) {
      case '':
        this.profileBtnStatus = status;
        break;
      case 'loading':
        this.profileBtnStatus = status;
        break;
      case 'error':
        this.profileBtnStatus = 'feedback-error';
        setTimeout(() => {
          this.setBtn('');
        }, 1000);
        break;
      case 'ok':
        this.profileBtnStatus = 'feedback-ok';
        setTimeout(() => {
          this.setBtn('');
        }, 1000);
        break;
      default:
        console.error('Invalid argument for setBtn()');
    }
  }

  getBtnStatus(): string {
    return this.profileBtnStatus;
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

  update(): void {
    if (this.profileAvatarModified)
      this.updateAvatar();

    if (this.profileBtnStatus !== '')
      return

    this.profileSent = true;
    if (this.profileForm.invalid) {
      if (this.profileForm.get('name').status === "INVALID") {
        this.applyShakeAnimation('name');
      }
      if (this.profileForm.get('birthday').status === "INVALID") {
        this.applyShakeAnimation('birthday');
      }

      this.setBtn('error');
      return;
    }
    this.setBtn('loading');

    const body = {
      name: this.profileForm.get('name').value,
      birthday: this.profileForm.get('birthday').value
    }

    this.httpService.buildUrl('users/me')
    .patch(body)
    .subscribe(
      (user: ProfileModel) => {
        this.setBtn('ok');
        this.httpService.saveLocalUser(user);
      }, (error: HttpErrorResponse) => {
        this.setBtn('error');
        // console.log(error);
      }
    )
  }

  updateAvatar(): void {
    this.setBtn('loading');
    const avatar = this.profileAvatarEvent.file.file;

    if (!avatar) {
      this.setBtn('error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    this.httpService.buildUrl('users/me/avatar')
    .post(formData)
    .subscribe(
      (user: ProfileModel) => {
        this.setBtn('ok');
        this.profileAvatarModified = false;
      }, (error: HttpErrorResponse) => {
        this.setBtn('error');
        // console.log(error);
      }
    )
  }
}
