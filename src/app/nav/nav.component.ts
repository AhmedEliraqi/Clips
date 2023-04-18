import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  constructor(public modal:ModalService,
    public Auth:AuthService,
  ) {
      Auth.IsAuthicated$
     }

  ngOnInit(): void {

  }
  //#region open the nav modal and toggle th auth modal
openModal($event:Event){
$event.preventDefault()
this.modal.ToggleModule("auth") //here we can authorize which to be shown
}
//#endregion

}
