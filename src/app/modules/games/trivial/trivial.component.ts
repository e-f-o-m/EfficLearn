import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trivial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trivial.component.html',
  styleUrls: ['./trivial.component.scss']
})
export class TrivialComponent {
  data: string[] = []
  isResourse = false
  item = ''
  pos = -1
  @ViewChild("value", { static: false }) value!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(){
    const _data = localStorage.getItem('trivial')
    if(_data){
      this.data = JSON.parse(_data).sort((a:string,b:string) => a>b)
    }
  }

  next(){
    this.pos++
    if(this.pos > this.data.length){
      this.pos = 0
    }
    this.item = this.data[this.pos]
  }

  toggleResourse(){
    this.isResourse = !this.isResourse
    this.data = this.value.nativeElement.value.split('\n')
    if(this.data.length > 1){
      localStorage.setItem('trivial', JSON.stringify(this.data))
    }
  }

}
