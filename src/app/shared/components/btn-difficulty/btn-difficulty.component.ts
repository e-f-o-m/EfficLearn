import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'btn-difficulty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-difficulty.component.html',
  styleUrls: ['./btn-difficulty.component.scss']
})
export class BtnDifficultyComponent {
  @Input() title = ""
  @Input() identifier = ""
  @Input() type:any = ""
  @Input() difficulty: string = ""
  @Output() eventClick = new EventEmitter<string>();
  
  onClick(){
    this.eventClick.emit(this.identifier)
  }
}
