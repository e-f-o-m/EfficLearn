import {  Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { GeneralTableResponse } from './GeneralTableResponse';

@Component({
  selector: 'general-table',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss']
})
export class GeneralTableComponent {
  @Output() rowEvent = new EventEmitter<GeneralTableResponse>();
  @Input()  tableData:Array<Array<GeneralTableResponse>> = [];
  /* headers: GeneralTableResponse[] = [] */
  
  constructor(){
  }
  
  ngAfterViewInit(){
    /* if(this.tableData.length > 0){
      this.headers = this.tableData[0]
    } */

    document.addEventListener('click', function(event) {
      var targetElement = event.target as HTMLInputElement;
      let elCheck = document.querySelectorAll(".option:checked") as NodeListOf<HTMLInputElement>;
      elCheck.forEach(element => { element.checked = false; }); 
      
      if (targetElement.className == "option") {
        targetElement.checked = true;
      }
    });
  }

  actionSelect(generalTableResponse: GeneralTableResponse){
    this.rowEvent.emit(generalTableResponse);
  }
  
  colSelect(generalTableResponse: GeneralTableResponse, colPos: number, rowPos: number){
    /* document.querySelectorAll(`.${this.table.identifier} .rowItem`).forEach(colItem => {
      colItem.classList.remove('selected');
    });
    document.querySelector(`.${this.table.identifier} .rowItem${rowPos}`)?.classList.add('selected') */
    generalTableResponse.state = "selected"
    this.rowEvent.emit(generalTableResponse);
  }
}
