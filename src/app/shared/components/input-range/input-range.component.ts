import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IField } from '../input/input.component';

@Component({
  selector: 'app-input-range',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss']
})
export class InputRangeComponent {
  @Input() data?: IField

  dataChange(target: any){
  }

  async ngOnInit() {
  }
}
