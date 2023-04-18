

import { ValidationErrors,AbstractControl,ValidatorFn } from '@angular/forms';


export class ResgisterValidators {  

//this is not used in static methods static mehtods don`t have properities of the class
//static methods are used for utility but they are limited to the scope
// Registermatch() with static run once during all the app

static Match(ControlName:string,ComparedControl:string):ValidatorFn{
    
//used as factory Function
return(group:AbstractControl):ValidationErrors|null=>{
    const Control=group.get("password")
    const ConfirmControl=group.get("Confirm_password")
    if (!Control ||!ConfirmControl) {
        console.error("Form Controls Are not Found In form Groups")
        return {ControlNotFound:false}   
    }
    const Error= Control.value===ConfirmControl.value?null:{Notmatch:true}
    ConfirmControl.setErrors(Error)
    return Error
    }       
}}
