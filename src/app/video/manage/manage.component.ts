import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router ,ActivatedRoute, Params} from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import Iclip from 'src/app/Modals/clip.modal';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';
//can be created with operator => make object wile subscribing 
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
//array of Iclip , user clip
  clips:Iclip[]=[]
// tracking current clip 
activeClip:Iclip|null=null

  //1 for the descending videos 
videoOrder="1"
//$ observale
sort$:BehaviorSubject<string>
showalert=false

constructor(private router:Router,
    private route:ActivatedRoute,
    public clipService :ClipService,
    private modal:ModalService) 
    {
      this.sort$= new BehaviorSubject(this.videoOrder)
    
     }

// Here we handle the queryparams for sorting
  ngOnInit(): void {
//make the queryparameter in route Module adds sort queryparamof value 1 or 2
this.route.queryParams.subscribe((params:Params)=>{
  this.videoOrder= params?.['sort'] ==="2" ? params?.['sort'] : "1"
  //add value while subscribing using BehaviorSubject<string> pipe
  this.sort$.next(this.videoOrder)
})

//#region get the user clips  according to the uuid of the user
this.clipService.getuserClips(this.sort$).subscribe(docs=>{
    this.clips=[]
    docs.forEach(doc=>{
  
      this.clips.push({
        //if docId ==> clips == doc.id ==> docs getuserClips
            docId:doc.id,
        ...doc.data()
      })
      
    })
  })

 //#endregion
 //#region soet the videos
  }
  sort($event:Event){
// the value of selection
   const {value}=($event.target as HTMLSelectElement)


//relative path navigate (["",""],{reative to:ActivatedRoute ,queryparams:{}})
 this.router.navigate([],{
   relativeTo:this.route,
   queryParams:{sort:value}
 })
}
//#endregion


//#region make the modal rendered according to the ModalId
openModal($event:Event,clip:Iclip){
    $event.preventDefault()  
    //update active clip
this.activeClip=clip


    //make the Modal visiable 
    this.modal.ToggleModule('editClip')

}
//#endregion


//#region  update the outputted EventEmitter from the edit component 
//note output should be in the child component and it will be transfered by the tag html
update($event:Iclip){
  this.clips.forEach(
    (elem,index)=>{if (elem.docId==$event.docId) 
    {
      this.clips[index].title=$event.title
    }
                  })
}

//#endregion


//#region  deleteClip 
deleteClip($event:Event, clip:Iclip){
  $event.preventDefault()
  this.clipService.deleteClip(clip)

  this.clips.forEach(
    (elem,index)=> {if (elem.docId ==clip.docId){
          this.clips.splice(index,1)
    }
  }
  )
}
//#endregion
//#region copyLink
 async copyLink($event:MouseEvent,docId:string|undefined){
 $event.preventDefault()
 if(!docId){return}
//locarion is from browser base url
const url=`${location.origin}/clip/${docId}`
//clipborad Api from broswer
await navigator.clipboard.writeText(url)

setTimeout(() => {
  this.showalert=true
}, 1000);
 this.showalert=false

 }
}

