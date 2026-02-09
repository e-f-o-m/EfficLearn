import { Component, Input } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { IField, InputComponent } from 'src/app/shared/components/input/input.component';

export interface IAlertEdit { title: string, message?: string, input?: IField, accept: (data?: any) => void, cancel: () => void,  delete?: () => void}

@Component({
  selector: 'alert-edit',
  standalone: true,
  imports: [ButtonComponent, InputComponent],
  templateUrl: './alert-edit.component.html',
  styleUrls: ['./alert-edit.component.scss']
})
export class AlertEditComponent {
  @Input() data?: IAlertEdit

  cancel() {
    this.data?.cancel()
  }
  accept(event: any) {
    event.preventDefault()
    if (!this.data?.input) {
      this.data?.accept()
      return
    }
    const formData = new FormData(event.target) as any;
    const fields = Object.fromEntries(formData);
    this.data?.accept(fields[this.data?.input?.id!])
  }
  deleteX() {
    if (!this.data?.input) {
      return
    }
    if (this.data?.delete) {
      this.data?.delete()
    }
  }

}
