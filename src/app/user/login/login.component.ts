import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
// store the credentials username and pass here you use the object to store the username and password 
//I didn`t use auth service 
  credentials={
    email:"",
    password:""
  }
  alertMsg="Please wait we are loging you In"
  bgColor="blue"
showalert=false
Insubmission=false
  //auth Login
  constructor(private auth:AngularFireAuth) { }

  ngOnInit(): void {
  }

  //#region sign in with Emial and password
async login(){
  this.alertMsg="Please wait we are loging you In"
  this.showalert=true
  this.Insubmission=true
  this.bgColor="blue"

  try {
  await this.auth.signInWithEmailAndPassword(
  this.credentials.email,this.credentials.password)
      } catch (e) {
this.alertMsg="Error happend while logining In"
this.showalert=true
this.Insubmission=false
this.bgColor="red"


console.log(this.credentials)

console.log(e)
return
  }


this.alertMsg="Succcess ! you are logged In"
this.bgColor="green"

}
//#endregion

}
