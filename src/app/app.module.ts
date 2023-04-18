import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from './shared/shared.module';
import{AngularFireModule}from'@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { FbtimestampPipe } from './pipes/fbtimestamp.pipe';
import { VideoModule } from './video/video.module';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    ClipComponent,
    NotFoundComponent,
    ClipsListComponent,
    FbtimestampPipe,
    
  ],
  imports: [

    BrowserModule,
    UserModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    AngularFireStorageModule,
    VideoModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
