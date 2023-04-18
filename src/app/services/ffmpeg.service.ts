import { Injectable } from '@angular/core';
import { createFFmpeg,fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
isrunning=false
isready=false
private ffmpeg
  constructor() {
    //generate logs in any command code
    this.ffmpeg=createFFmpeg({log:true})
   }
   // webAssembly file ,large
   async init(){
      if(this.isready){
        return 
      }
      await this.ffmpeg.load()
      //will get into the async function forever
      this.isready=true
      
   }
   async getScreenShots(file:File){
     this.isrunning=true
    
     
     //changing the file into binary data
    const data=await fetchFile(file)


    //filesystem gives you access in fependent file system
    //parameters 1- write or read  2- ,filename , 3- databinary
    this.ffmpeg.FS('writeFile',file.name,data)




    //#region running the ffmpeg using arrays of commands to generate multiple screen shoots
    //start running our amazing tool
  const seconds=[1,5,6,7,9,1]
  const comands:string[]=[]


  seconds.forEach(second => {
        comands.push(
          //Input -i grap file
      '-i',file.name,
      //output Options -ss current timestamp
      '-ss',`00:00:0${second}`,
      //frames to focus on
      '-frames:v', '1',
      //width and height of the image scale dimesions width:height aspect ratio can be done by -1in height
      '-filter:v','scale=510:-1',
      //output
      `output_0${second}.png`
        )
  });
  
    await this.ffmpeg.run(
            ...comands
    )
    //#endregion

    //#region reading binary files
    const screenshots:string[]=[]
    seconds.forEach(second=>{
   const screenshotfile=this.ffmpeg.FS('readFile',`output_0${second}.png`)
   //blob immutable (binary large objects) like array we store binary data to url
   //blob(arraybuffer,{additional list} )
const screenShotBlob=new Blob(
  [screenshotfile.buffer],{type:'image/png'}
)
   //create url from obkect
  const screenShotsURL= URL.createObjectURL(screenShotBlob)
   screenshots.push(screenShotsURL)
})
this.isrunning=false
return screenshots
//#endregion
   }

   async blobFromURL(url:string){
     //fetch url as a request
     const response=await fetch(url)
     const blob =response.blob()
     return blob
   }
}
