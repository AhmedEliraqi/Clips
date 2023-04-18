import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import Iclip from 'src/app/Modals/clip.modal';
import { ClipService } from './../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit,OnDestroy,OnChanges {

  //#region  form variables 
//alert variables
showAlert=false
Color="blue"
get alertColor(){return `bg-${this.Color}-400`}
alertMsg="please wait updating clip"
//submitting variables
inSubmission=false

  //active clip from the manage component
@Input() activeClip:Iclip|null=null
@Output() update =new EventEmitter()
clipId= new FormControl("")
title:FormControl =new FormControl("",[
  Validators.required,
  Validators.minLength(3)
])
//group controls
editForm :FormGroup=new FormGroup({
  title:this.title,
  id:this.clipId
})
//#endregion

  constructor(private modal:ModalService,private clipService:ClipService) { }

//#region open the registered modal
  ngOnInit(): void {
    this.modal.register('editClip')
  }
//#endregion 


//#region  destroy the modal after closing the modal
ngOnDestroy(): void {
    this.modal.unRegister('editClip')
}
//#endregion

//#region on every change update values
ngOnChanges(): void {
    if(!this.activeClip){
      return
    }
    this.inSubmission=false
    this.showAlert=false
    this.clipId.setValue(this.activeClip.docId)
    this.title.setValue(this.activeClip.title)
}
//#endregion

//#region  submit the form after changing the title
async submit(){
  if(!this.activeClip){
    return
  }
  this.inSubmission=true
  this.showAlert=true
  this.Color="blue"
  this.alertMsg="please wait ! updating the clip."
try{
 await  this.clipService.updateClip(this.clipId.value,this.title.value)
}catch(e){
      this.inSubmission=false
      this.Color="red"
      this.alertMsg="somethin gsent wrong. try again later"
      return 
}
    this.inSubmission=false
    this.Color='green'
    this.alertMsg='Success !'
    this.activeClip.title=this.title.value
  this.update.emit(this.activeClip)

}
//#endregion
}
