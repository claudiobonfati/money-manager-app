import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeModule } from './welcome/welcome.module';
import { SigninModule } from './signin/signin.module';
import { RegisterModule } from './register/register.module';
import { UsersModule } from './users/users.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';

import { environment } from '../environments/environment';

const appRoutes: Routes = [
  { 
    path: '', 
    component: WelcomeComponent,
    data: {
      class: "page-welcome"
    }
  }, { 
    path: 'signin', 
    component: SigninComponent,
    data: {
      class: "page-signin"
    }
  }, { 
    path: 'register', 
    component: RegisterComponent,
    data: {
      class: "page-register"
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    WelcomeModule,
    SigninModule,
    RegisterModule,
    UsersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
