import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component'

import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';


registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
);

import { FeatherModule } from 'angular-feather';
import { Edit2, Plus } from 'angular-feather/icons';

const icons = {
  Edit2,
  Plus
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
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FeatherModule.pick(icons),
    FilePondModule
  ]
})
export class UsersModule { }
