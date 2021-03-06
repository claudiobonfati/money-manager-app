import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeModule } from './welcome/welcome.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UsersModule } from './users/users.module';
import { UnauthGuard } from 'src/app/core/guards/unauth.guard'

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './core/components/menu/menu.component';

import { environment } from '../environments/environment';

import { FeatherModule } from 'angular-feather';
import { Home, Plus, User, Mail, Key, Delete, Loader, Check, AlertTriangle, HelpCircle } from 'angular-feather/icons';

const icons = {
  Home,
  Plus,
  User,
  Mail,
  Key,
  Delete,
  Loader,
  Check,
  AlertTriangle,
  HelpCircle
};

const appRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [UnauthGuard],
    data: {
      class: "page-welcome"
    }
  }, {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard],
    data: {
      class: "page-login"
    }
  }, {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
    data: {
      class: "page-register"
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    WelcomeModule,
    LoginModule,
    RegisterModule,
    UsersModule,
    FeatherModule.pick(icons)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
