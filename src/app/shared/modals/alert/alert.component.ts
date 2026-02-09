import { Component, Input } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { IField, InputComponent } from 'src/app/shared/components/input/input.component';

export interface IAlert {title: string, message?: string, input?: IField, accept: (data?: any)=>void, cancel: ()=>void }

@Component({
  selector: 'alert',
  standalone: true,
  imports: [ ButtonComponent, InputComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() data?: IAlert

  cancel(event: any) {
    this.data?.cancel()
    
  }
  accept(event: any) {
    event.preventDefault()
    if(!this.data?.input){
      this.data?.accept()
      return
    }
    const formData = new FormData(event.target) as any;
	  const fields = Object.fromEntries(formData);
    this.data?.accept(fields[this.data?.input?.id!])
  }
}
