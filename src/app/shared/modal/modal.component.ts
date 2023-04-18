import { Component, OnInit ,Input, ElementRef} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
@Input () ModalId=""
  constructor(public modal:ModalService,public el:ElementRef) { 
 
  }

  ngOnInit(): void {
   document.body.appendChild(this.el.nativeElement) //append child component of another component into the body component
  
  }

  closeModal(){
    this.modal.ToggleModule(this.ModalId)
  
  }
  ngOnDestroy(): void {
    
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    document.body.removeChild(this.el.nativeElement)
  }

}
