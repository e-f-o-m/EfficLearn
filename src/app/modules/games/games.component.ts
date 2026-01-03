import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QuestionSet } from 'src/app/core/models/QuestionSet';
import { getNameListsLS } from 'src/app/core/services/localstorange/LS.list';
import { CardGameComponent } from 'src/app/shared/components/card-game/card-game.component';
import { LocalstorageService } from 'src/app/core/services/localstorange/localstorange.service';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGameComponent],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  constructor(private readonly _localstorageService: LocalstorageService) {}

  lists: QuestionSet[] = [];

  ngOnInit() {
    this.lists = getNameListsLS()
    this._localstorageService.gameSelected = ''
  }
}
