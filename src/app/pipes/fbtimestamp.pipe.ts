
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import firebase  from 'firebase/compat';
@Pipe({
  name: 'fbtimestamp'
})

export class FbtimestampPipe implements PipeTransform {
constructor(private DatePipe:DatePipe){}
  transform(value: firebase.firestore.FieldValue|undefined){
    if(!value){
      return ''
    }
    const date =(value as firebase.firestore.Timestamp).toDate() 
    return this.DatePipe.transform(date,'mediumDate');
  }

}
  