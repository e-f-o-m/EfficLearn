import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Input() data?: {type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: () => void } 
  color?: {
    s: { color: string, icon: string },
    i: { color: string, icon: string },
    w: { color: string, icon: string },
  } = {
    s: { color: "#2BDE3F", icon: '/assets/success.svg' },
    i: { color: "#1D72F3", icon: '/assets/info.svg' },
    w: { color: "#FFC007", icon: '/assets/warning.svg' },
  }
  
  ngOnChanges(){
    if(!this.data?.timeS) return
    setTimeout(() => {
      this.data?.end()
    }, this.data?.timeS*1000);
  }
}
