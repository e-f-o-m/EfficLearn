import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFullData } from '@core/models/IData';
import { Router, RouterModule } from '@angular/router';
import { getNameListsLS } from '@core/services/localstorange/LS.list';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  constructor(private router: Router) {}

  lists: IFullData[] = [];

  ngOnInit() {
    this.lists = getNameListsLS()
  }

  selectList(item: IFullData){
    console.log('>> >>  :', item);
    //localStorage.setItem("listSelected", item.id)
    //this.router.navigate(['/multiplecards']);
  }
}
