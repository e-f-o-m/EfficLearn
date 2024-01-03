import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  type = "text"
  placeholder = "test"
  identifier = "test"
  value = ""
  name="Test"

  dataChange(target: any){

  }
  
}
