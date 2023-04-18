import { Component, OnInit, ElementRef } from '@angular/core';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private el:ElementRef) { }

  ngOnInit(): void {
    for (let element of this.el.nativeElement.querySelectorAll(".typing")) {
	let length = element.textContent.length;
	element.style.setProperty("--length", length);
}
  }
  

}
