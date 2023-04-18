import { Component, Input, OnInit } from '@angular/core';
import {  FormControl } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent implements OnInit {


  //#region input attributes
@Input() control:FormControl=new FormControl()
@Input() type=""
@Input() placeholder=""
@Input() format=""
@Input() prefix=""
//#endregion
  constructor() { }

  ngOnInit(): void {
  }

}
