import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { IField } from '../input/input.component';

@Component({
  selector: 'app-input-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss']
})
export class InputSwitchComponent {
  @Input() data?: IField

  dataChange(target: any){

  }
  
}
