import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() title = ""
  @Input() identifier = ""
  @Input() type:any = ""
  @Input() disabled:boolean = false
  @Output() eventClick = new EventEmitter<string>();


  onClick(){
    this.eventClick.emit(this.identifier)
  }
}

/* implementation
<app-button [title]="'direct or var'" (eventClick)="handleClickBtnX($event)"></app-button> 
*/
