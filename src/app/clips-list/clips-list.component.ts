import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
   providers:[DatePipe]
})
export class ClipsListComponent implements OnInit ,OnDestroy {
@Input() Scrollable=false 
  constructor(public clipsService:ClipService) { 
    this.clipsService.getClips()
  }

  ngOnInit(): void {
    window.addEventListener('scroll',this.handleScroll)

  }
   ngOnDestroy(){
    window.removeEventListener('scroll',this.handleScroll)  
    }
  handleScroll=()=>{
    //offsetHeight
    //if scrollTop + innerHeight = offsetHeight ==>send request
    const{scrollTop,offsetHeight}=document.documentElement
    const{innerHeight}=window

const bottomOfWindow=Math.round(scrollTop)+innerHeight ===offsetHeight

    if (bottomOfWindow && this.Scrollable) {
      this.Scrollable=true
      
     this.clipsService.getClips()
      
    }
  }
 
}
