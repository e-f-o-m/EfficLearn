import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'btn-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-game.component.html',
  styleUrls: ['./btn-game.component.scss']
})
export class BtnGameComponent {
  @Input() title = ""
  @Input() identifier = ""
  @Input() type:any = ""
  @Input() disabled: boolean = false
  @Input() difficulty: string = ""
  @Output() eventClick = new EventEmitter<string>();
  
  onClick(){
    this.eventClick.emit(this.identifier)
  }
}
