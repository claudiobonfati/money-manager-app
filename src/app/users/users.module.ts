import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import { FeatherModule } from 'angular-feather';
import { Edit2, Plus, Loader, Check, AlertTriangle } from 'angular-feather/icons';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
);

const icons = {
  Edit2,
  Plus,
  Loader,
  Check,
  AlertTriangle
};

const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      class: "page-dashboard"
    }
  }, { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      class: "page-profile"
    }
  }, { 
    path: 'new-transaction', 
    component: NewTransactionComponent,
    canActivate: [AuthGuard],
    data: {
      class: "page-new-transaction"
    }
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    NewTransactionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FeatherModule.pick(icons),
    FilePondModule
  ]
})
export class UsersModule { }
