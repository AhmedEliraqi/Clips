import { Component, OnInit ,ContentChildren, AfterContentInit,QueryList} from '@angular/core';
import { TabComponent } from './../tab/tab.component';


@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements OnInit,AfterContentInit {

@ContentChildren(TabComponent) tabs?:QueryList<TabComponent>=new QueryList() //optional with ?

  constructor() { }

  ngOnInit(): void {
   
   }
   ngAfterContentInit(){//filter
     const Activetabs=this.tabs?.filter(t=>t.active)
    
     if (!Activetabs ||Activetabs.length===0) {

       this.SelectTab(this.tabs!.first)
     }
   }
   SelectTab(tab:TabComponent){
          this.tabs?.forEach(a=>a.active=false)
          tab.active=true   
          return false
}

   

}
