import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipService } from './services/clip.service';//from observable

const routes: Routes = [
  {//base gives angular /
    path:"",component:HomeComponent 
  },
  {
    path:"about",component:AboutComponent
  },
  {path:"clip/:id",component:ClipComponent,data:{authOnly:true},
  resolve:{ clip:ClipService}}, //search for route in service visit this every time he goes to clip //resolve add a list of observables
{path:"", //;lazyloading
loadChildren: async()=> (await import('./video/video.module')).VideoModule},
 {path:"**",component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {}
