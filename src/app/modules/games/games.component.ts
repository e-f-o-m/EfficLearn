import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionSet } from '@core/models/QuestionSet';
import { Router, RouterModule } from '@angular/router';
import { getNameListsLS } from '@core/services/localstorange/LS.list';
import { CardGameComponent } from '@shared/components/card-game/card-game.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGameComponent],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  constructor(private router: Router) {}

  lists: QuestionSet[] = [];

  ngOnInit() {
    this.lists = getNameListsLS()
  }

  selectList(item: QuestionSet){
    console.log('>> >>  :', item);
    //localStorage.setItem("listSelected", item.id)
    //this.router.navigate(['/multiplecards']);
  }
}
