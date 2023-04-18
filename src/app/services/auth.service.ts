import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { IUser } from './../Modals/User.modal';
import{map,delay,filter,switchMap}from"rxjs/operators"
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

//store users status
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private UserCollections:AngularFirestoreCollection<IUser> 
public IsAuthicated$:Observable<boolean>
public IsAuthicatedwithDelay$:Observable<boolean>
public Redirect=false
//you have to initilize the user collections of type AngularFirestoreCollection
  constructor(
    private Auth:AngularFireAuth,
    private db:AngularFirestore, public afAuth:AngularFireAuth ,
    public router:Router,
    private route :ActivatedRoute) {
      this.UserCollections=db.collection("users")
// boolean if the user authorized or not
    this.IsAuthicated$=this.Auth.user.pipe(
      map(user=>!!user)
    )
//#region delay the modal
    this.IsAuthicatedwithDelay$=this.IsAuthicated$.pipe(
      delay(1000)
    )
//#endregion


//#region  redirect the user if the component has routing data authOnly
this.router.events.pipe(
  filter(e=>e instanceof NavigationEnd),
  map(e=>this.route.firstChild) 
  ,switchMap(route=>route?.data ?? of({})) //nullish
  ).subscribe(data=>{
    this.Redirect=data?.["authOnly"] ??false
  }) 
//#endregion
}
//end constructor
  
//#region Create user in the dataBase
//if the password which is nullable is null
  public async CreateUser(userDate:IUser){
    if(!userDate.password){
      throw new Error("password povided is empty")
    }

      const userCred= await this.Auth.createUserWithEmailAndPassword(userDate.email,userDate.password)

      
    if(!userCred.user){
      throw new Error("User is Not Found")
    }
//Add is not found in the doc which returns the user, so we use set
//doc takes the path or the Unique Id
//token will not be awailable if we swap the order of create users and write to the database
    await this.UserCollections.doc(userCred.user.uid).set({
    name:userDate.name,
    email:userDate.email,
    age:userDate.age,
    phoneNumber:userDate.phoneNumber
  })
  //Store the name and the profile Photo
  await userCred.user.updateProfile({
    displayName:userDate.name
  })
  
  }
//#endregion

  //#region logOut user
  public  async logout($event?:Event){
    if($event){
$event.preventDefault()}
  await this.Auth.signOut()
 if(this.Redirect)
  await this.router.navigateByUrl("/")
}
//#endregion
}
