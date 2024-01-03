import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'btn-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-img.component.html',
  styleUrls: ['./btn-img.component.scss']
})
export class BtnImgComponent {
  @Input() type:string = ""
  @Input() identifier = ""
  @Input() imgPath: string = ""
  @Output() eventClick = new EventEmitter<string>();
  
  onClick(){
    this.eventClick.emit(this.identifier)
  }
}
/* <btn-img 
        identifier="menu" 
        imgPath="assets/menu.svg" 
        (eventClick)="isMenuOptions=!isMenuOptions" 
        [type]="isMenuOptions? 'orange':'green'"></btn-img> */