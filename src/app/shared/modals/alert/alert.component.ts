import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'alert',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() data?: {title: string, message: string, accept: ()=>void, cancel: ()=>void }
  
  cancel() {
    this.data?.cancel()
  }
  accept() {
    this.data?.accept()
  }
}
