import { Injectable } from '@angular/core';

import { AngularFirestore,AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import Iclip from '../Modals/clip.modal';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, of, map,BehaviorSubject,combineLatest, lastValueFrom} from 'rxjs';
import { Resolve,ActivatedRouteSnapshot,RouterStateSnapshot ,Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<Iclip|null> {
pageClips:Iclip[]=[]
pendingRequest=false
public clipsCollection:AngularFirestoreCollection<Iclip>


  constructor(private db:AngularFirestore,private auth:AngularFireAuth,
    private storage :AngularFireStorage, private route:Router) { 
    //copy the collection called clips
    this.clipsCollection=db.collection('clips')
  }





//#region create clip
 createclip(data:Iclip):Promise<DocumentReference<Iclip>>{
   return   this.clipsCollection.add(data)

  }
  //#endregion
 
 
  //#region get the user clips
  //now we subscribe to two Observables using Behavior subject sort$ from manageComponent also we comine them using combineLatest ==> accepts array of observables in pipe line (switchMap) we accept object
getuserClips(sort$:BehaviorSubject<string>){
  
  return combineLatest([this.auth.user, sort$]).pipe(
    //switchMap will subscribe in the two observables ==> user ,sort 
    //deconstructing the two from values
    switchMap(values=>{
      const[user,sort]=values
      if(!user){
          return of([])
      }
//query the database to get the user matches the id
      const query =this.clipsCollection.ref.where(
        'uid','==',user.uid
      ).orderBy(
        'timestamp',
        sort =='1'?'desc':'asc'
      )
      return query.get()

    }),
    //make sure it is of type Iclip
     map(snapshot=>(snapshot as QuerySnapshot<Iclip>).docs )
    )
}
//#endregion

//#region  update the clip ,, all the clip ==>object ==> update firbase doc  
updateClip(id:string ,title:string){
    return this.clipsCollection.doc(id).update({
       title
     })
    }
//#endregion

 async deleteClip(clip:Iclip){
   const ClipRef=this.storage.ref(`clips/${clip.fileName}`)
   const ScreenShotRef=this.storage.ref(
     `screenshoots/${clip.screenShotFileName}`
   )
    await ClipRef.delete()
await ScreenShotRef.delete()
    //select the doc with doc function  the same as update
   await this.clipsCollection.doc(clip.docId).delete()
 

}
//#region quering the clips
async getClips(){
  if (this.pendingRequest) {
     return
  }
  this.pendingRequest=true

    let query= this.clipsCollection.ref.orderBy('timestamp','desc').limit(6)
//store the previous clips 
const{length}=this.pageClips



if (length) {
  const lastDocID=this.pageClips[length-1].docId 
const lastDoc=await lastValueFrom( this.clipsCollection.doc(lastDocID).get())
       
      query=query.startAfter(lastDoc)
}
//geting the query
const snapshot=await query.get()
//pushing in the array
snapshot.forEach(doc=>{
  this.pageClips.push({
    docId:doc.id,
    ...doc.data()
  })
})
this.pendingRequest=false
}
//#endregion

//#region resolve to get the clip for the component
 resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
 return  this.clipsCollection.doc(route.params?.['id']).get().pipe(
   map(snapshot=>{
     const data=snapshot.data()
     if(!data){
       this.route.navigate(['/']) //redirect the user to home note we redirecting from observables
        return null
      }
      return data
   })
 )

}
//#endregion
}
