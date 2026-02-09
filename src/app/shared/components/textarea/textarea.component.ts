import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IField {
  id?: string;
  label?: string;
  placeholder?: string;
  values?: string[];
  /* optionSelect?: string; */
  typeFormControl?: 'warn' | 'info' | 'input-number' | 'input-text' | 'input-serach'; //attachment, list, radio, color
  options?: { name: string, value: string }[];
  conditions?: Condition[];
  attachment?: IAttachment;
  /* position?: number; */
}
export interface IAttachment {
  contentBase64: string,
  fileName: string,
  contentType: string,
  ext?: string
  file?: File
}
export interface Condition {
  validator?: string;
  value?: string;
  action?: string;
}

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent {
  @Input() data?: IField
  @Output() event = new EventEmitter()

  dataChange(target: any) {
    this.event?.emit(target.value)
  }

}
