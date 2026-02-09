import { Component, Input } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { IAlert } from 'src/app/shared/modals/alert/alert.component';

@Component({
  selector: 'cards-mode',
  standalone: true,
  imports: [ButtonComponent ],
  templateUrl: './cards-mode.component.html',
  styleUrls: ['./cards-mode.component.scss']
})
export class CardsModeComponent {
  @Input() data?: IAlert

  cancel() {
    this.data?.cancel()
  }
  accept(item: string) {
    this.data?.accept(item)
  }

}
