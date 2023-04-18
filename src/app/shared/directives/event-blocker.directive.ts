import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
}
)
export class EventBlockerDirective {

//access the host first
@HostListener("drop",['$event']) //listens to the event
@HostListener("dragover",['$event'])  //listens to stop drag on other file
public handleEvent(event:Event){
  
event.preventDefault()

}


}
