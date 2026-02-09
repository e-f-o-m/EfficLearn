import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent {
  @Output() filesEvent = new EventEmitter<FileList>();
  @Input() name: string = '';
  @Input() identifier: string = '';

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if(files != null){
      this.filesEvent.emit(files);
    }
  }
}
