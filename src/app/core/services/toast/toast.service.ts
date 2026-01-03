import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface IToast {
  id?: number; type: 's' | 'i' | 'w'; timeS: number; title?: string; message?: string; /* end: () => void */ 
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<IToast[]>([]);
  toasts$ = this.toastSubject.asObservable();
  private currentId = 0;

  setToast(toastData: IToast): number {
    const id = ++this.currentId;
    const toastWithId: IToast = { ...toastData, id };
    
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, toastWithId]);

    // Auto-remover después del tiempo especificado
    setTimeout(() => {
      this.removeToast(id);
      /* toastData.end?.(); */
    }, toastData.timeS * 1000);

    return id;
  }

  removeToast(id: number): void {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAll(): void {
    this.toastSubject.next([]);
  }
}