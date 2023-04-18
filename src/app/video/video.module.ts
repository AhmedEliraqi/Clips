import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafeurlPipe } from './pipes/safeurl.pipe';




@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent,
    EditComponent,
    SafeurlPipe,
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule ,//to access the Event blocker directive
    ReactiveFormsModule,
   
  ]
})
export class VideoModule { }
