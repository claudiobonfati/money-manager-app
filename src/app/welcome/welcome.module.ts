import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';



@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class WelcomeModule { }
