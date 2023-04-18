import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputsComponent } from './inputs/inputs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';
//import { ModalService } from '../services/modal.service';


@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputsComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  exports:[
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputsComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  
})
export class SharedModule { }
