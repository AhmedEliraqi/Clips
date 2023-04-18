import { Component, OnInit, ViewChild, ElementRef ,ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Params ,Router} from '@angular/router';
import videojs from 'video.js';
import Iclip from './../Modals/clip.modal';
import { DatePipe } from '@angular/common';
import { ClipService } from './../services/clip.service';
@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
 providers:[DatePipe],
  encapsulation:ViewEncapsulation.None
})
export class ClipComponent implements OnInit {
clip?:Iclip
Scrollable=false
//ngafterinit wait to the template but the video tag is static so we can acertain thet it is static 
//called before the ngonit function called to prepare the tag
@ViewChild("videoPlayer",{static:true}) target?:ElementRef
player?:videojs.Player

  constructor(
    public route:ActivatedRoute,
    private router:Router,
    private clipsService:ClipService) { }

  ngOnInit(): void {
      window.addEventListener('scroll',this.handleScroll)
    //have to the access to the target of the video through viewchild and eleRef
    this.player=videojs(this.target?.nativeElement)
  //#region 
 
  this.route.data.subscribe(data=>{
  this.clip=(data?.['clip'] as Iclip)
  this.player?.src({
    src:this.clip.url,
    type:'video/mp4'
  })
  })
//#endregion
  }
  
 
   ngOnDestroy(){
    window.removeEventListener('scroll',this.handleScroll)  
    }
  handleScroll=()=>{
    //offsetHeight
    //if scrollTop + innerHeight = offsetHeight ==>send request
    const{scrollTop,offsetHeight,scrollHeight}=document.documentElement

const bottomOfWindow=Math.round(scrollTop)+offsetHeight === scrollHeight

    if (bottomOfWindow) {
      this.Scrollable=true
     this.clipsService.getClips()
    }
  }

  

 
}
