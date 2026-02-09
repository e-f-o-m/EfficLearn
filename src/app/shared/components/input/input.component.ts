import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() data?: IField
  @Output() event = new EventEmitter()
  @ViewChild('miInput') miInput!: ElementRef<HTMLInputElement>;

  dataChange(target: any) {
    this.event?.emit(target.value)
  }
}
