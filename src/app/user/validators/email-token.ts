import { Injectable } from '@angular/core';
import { AbstractControl,ValidationErrors,AsyncValidator } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


//make the class able to be injected
//but where
@Injectable({
    providedIn:"root"
})

export class EmailToken implements  AsyncValidator{
    constructor(private Auth:AngularFireAuth){}

//promise to search for the provided email true ==> error ,null
validate=(control: AbstractControl): Promise<ValidationErrors | null> =>{
    
   return this.Auth.fetchSignInMethodsForEmail(control.value).then(Response=>Response.length ? {emailtoken:true}:null)
}
}
