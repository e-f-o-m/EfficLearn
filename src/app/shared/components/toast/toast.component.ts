import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IToast, ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  color: {
    i: { color: string, icon: string },
    s: { color: string, icon: string },
    w: { color: string, icon: string },
  } = {
    i: { color: "#1D72F3", icon: '/info.svg' },
    s: { color: "#2BDE3F", icon: '/success.svg' },
    w: { color: "#FFC007", icon: '/warning.svg' },
  }

  toasts: IToast[] = [];
  
  constructor(private readonly toastService: ToastService, private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
      this.changeDetectorRef.detectChanges();
    });
  }

  onClose(id: number): void {
    this.toastService.removeToast(id);
  }
}
