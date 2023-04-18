import { Component, Input } from '@angular/core';
import { FormGroup, FormControl,Validators, PatternValidator } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { ResgisterValidators } from '../validators/resgister-validators';
import { EmailToken } from '../validators/email-token';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  { //container for one form 
  constructor(private auth :AuthService,private emailtoken:EmailToken){}
// to know if the user submitted the form or not
InSubmission=false

//#region make form controls for every input
 name=new FormControl("",[
        Validators.required,
        Validators.minLength(4)
      ]) //default values in contructor of FormGroup
email=new FormControl('',[
        Validators.email,
        Validators.required
      ],[this.emailtoken.validate])
age=new FormControl('',[
      Validators.required,
      Validators.min(18),
      Validators.max(60)
      ])
password=new FormControl('',[
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
      ]
)
Confirm_password=new FormControl('',[
  Validators.required,

])
phoneNumber=new FormControl('',[
  Validators.minLength(16),
  Validators.maxLength(18)
])
//#endregion

//#region create FormGroup to store forms
registerForm=new FormGroup({
    name:this.name,
    email:this.email,
    age:this.age,
    password:this.password,
    Confirm_password:this.Confirm_password,
   phoneNumber:this.phoneNumber
},[ResgisterValidators.Match("password","Confirm_password")])
showAlert=false 
alertMg=""
bgColor=""
//#endregion


//#region submit register to  ApI and create user using create user from auth service
async register(){
  this.showAlert=true
  this.alertMg="Please wait! your Account is being Created"
  this.bgColor="blue"
  //create user
  try{

await this.auth.CreateUser(this.registerForm.value)

//catch errors in universial
}catch(e){
console.log(e)
this.alertMg="An error happen , please try again later"
this.InSubmission=false
this.bgColor="red"
return   
}
this.alertMg="success the account has been created"
this.bgColor="green"
}
//#endregion

}
