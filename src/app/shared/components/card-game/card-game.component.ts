import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-game',
  standalone: true,
  imports: [],
  templateUrl: './card-game.component.html',
  styleUrl: './card-game.component.scss'
})
export class CardGameComponent {
  @Input() title?: string
  @Input() description?:string
  @Input() img?:string
}
