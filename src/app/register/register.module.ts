import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { Loader, Check, AlertTriangle } from 'angular-feather/icons';

const icons = {
  Loader,
  Check,
  AlertTriangle
};

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FeatherModule.pick(icons),
    RouterModule
  ]
})
export class RegisterModule { }
