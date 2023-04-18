import { Component,  OnDestroy } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/compat/storage';
import{v4 as uuid}from"uuid" //to set unique id for files
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from './../../services/ffmpeg.service';
import {  switchMap,combineLatest ,forkJoin } from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

isDragOver=false
file :File|null=null
nextStep =false
showAlert=false
color=''
get bgcolor(){ return `bg-${this.color}-400`}
alertMsg='please wait you Clip is beign Uploaded. '
inSubmission=false
user :firebase.User|null =null

downloadUrl="";
percentage=0
showpercentage=false

task?:AngularFireUploadTask

screenshots:string[]=[]
selectedScreenShot:string=''
screenshotTask?:AngularFireUploadTask

title:FormControl =new FormControl("",[
  Validators.required,
  Validators.minLength(2)
])
uploadForm :FormGroup=new FormGroup({
  title:this.title
})

constructor(
      private storage:AngularFireStorage,
     private auth:AngularFireAuth,
     private clipService:ClipService,
     private router:Router,
     public ffmpegservice:FfmpegService) { 
       auth.user.subscribe(user=>this.user=user)
       this.ffmpegservice.init()
       
     }
// if the use renavigate to any component
  ngOnDestroy(): void {

    this.task?.cancel()
     this.screenshotTask?.cancel()

  }
  //#region cancel by cancel bytton
  cancel(){
     
     this.inSubmission=false
     this.alertMsg="Upload Canceled. "
     this.color ='red'
     this.task?.cancel()
     this.screenshotTask?.cancel()
      
  }
  //#endregion
  
//#region  store the file in file :File|null=null
async storeFile($event:Event){
  //stop the user uploading while processing the screen shots
  if(this.ffmpegservice.isrunning){
    return
  }
 
  this.isDragOver=false
   this.file=($event as DragEvent).dataTransfer ?
   ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
   ($event.target as HTMLInputElement).files?.item(0) ?? null
  
   //dataTransfer is not Found  we should acertain it and we have to make it  accept nullish value 
   
if(!this.file ||this.file.type !=='video/mp4')
    {
    this.alertMsg="this is not an mp4 video"
    this.showAlert=true
    this.color='red'
        return 
    }
    //getting the screenshots
      this.showAlert=false
this.screenshots=await this.ffmpegservice.getScreenShots(this.file)
this.selectedScreenShot=this.screenshots[0]

    //changing the name
this.title.setValue(this.file.name.replace(/\.[^/.]+$/,''))
this.nextStep=true  
                    
}
//#endregion

//#region  upload the file using  AngularFireStorage
async uploadFile(){
  
  this.uploadForm.disable()
  this.showAlert=true
  this.color='blue'
  this.alertMsg="please wait you Clip is beign Uploaded."
  this.inSubmission=true
  this.showpercentage=true

  const ClipFileName=uuid()

 const clipPath=`clips/${ClipFileName}.mp4` //if the firectory doesn`t exit it will be created 
 const screenshotBlob=await this.ffmpegservice.blobFromURL(this.selectedScreenShot)
const screenshootpath=`screenshoots/${ClipFileName}.png`
 this.task= this.storage.upload(clipPath,this.file) //uploading the file (name,fileitself

//reference to the video file
const fileRef=this.storage.ref(clipPath)

//upload the screenshot
this.screenshotTask=this.storage.upload(screenshootpath,screenshotBlob)
const ScreenShotRef=this.storage.ref(screenshootpath)
//this.PercentageChanges=upload.percentageChanges()
//calculate the two Observables of screenshots and file
combineLatest([
  this.task.percentageChanges(),
  this.screenshotTask.percentageChanges()
]).subscribe((progress)=>{
  const [ClipProgress,ScreenShotProgress] =progress
  if(!ClipProgress||!ScreenShotProgress)return
  const total =ClipProgress+ScreenShotProgress 
  this.percentage=total as number /200
})

//detecting the changes on the file
 forkJoin([
   this.task.snapshotChanges(),
   this.screenshotTask.snapshotChanges()
        ]).pipe(
 
        switchMap(
        ()=>forkJoin([fileRef.getDownloadURL(),
          ScreenShotRef.getDownloadURL()
        ]))
         ).subscribe({
  next: async (urls)=>{
    const[ClipUrl,screenShotURL]=urls
    const clip={
      uid:this.user?.uid as string,
      displayName:this.user?.displayName as string,
      title:this.title.value,
      fileName:`${ClipFileName}.mp4`,
      url:ClipUrl,
      screenShotURL,
      screenShotFileName:`${ClipFileName}.png`,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
                }
   const ClipRef= await  this.clipService.createclip(clip)
    this.color='green'
    this.alertMsg="sucess your clip is ready to share to the world !"
    this.showpercentage=false
    setTimeout(() => { //from docReference  i get the Id
      this.router.navigate(['clip',ClipRef.id])
    }, 1000);

  },
  error:(err)=>{

    this.uploadForm.enable()
    this.color='red';
    //change the message for cancel upload
    err.message =='Firebase Storage: User canceled the upload/download. (storage/canceled)'? this.alertMsg="Upload Canceled" 
    : this.alertMsg="Error happened while uploading , please try again later";
      this.inSubmission=true
    this.showpercentage=false
    console.log(err.message)

  }
})


}
//#endregion
}
 