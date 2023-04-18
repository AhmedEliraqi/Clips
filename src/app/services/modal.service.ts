import { Injectable } from '@angular/core';


interface IModal{
  id:string,
  visible:boolean
}
@Injectable(
  {providedIn:"root"}
)
export class ModalService {

public modals:IModal[]=[]

  constructor() { }
  //#region register modal
register(id:string){
  this.modals.push({
    id,
    visible:false
  })
}
//#endregion

//#region un register the modal to remove it from amgular modules
unRegister(id:string){  this.modals=this.modals.filter(a=>a.id!=id)
}


  isModaleVisible(id:string):boolean{ //!! convert it to boolean , you can wrap it i Boolean()

      return !!this.modals.find((a)=>a.id===id)?.visible//optional chaning if null stop ,do not go to visible
  }
  //#endregion

  //#region toggggling modal in components just call it
  ToggleModule(id:string){
    const modal=this.modals.find((a)=>a.id==id)
    if(modal){
  modal.visible=!modal.visible
    }

  }
  //#endregion

}
