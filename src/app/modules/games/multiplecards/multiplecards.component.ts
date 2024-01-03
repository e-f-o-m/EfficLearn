import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, IFullData } from '@core/models/IData';
import { getLastListsLS } from '@core/services/localstorange/LS.list';

@Component({
  selector: 'app-multiplecards',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './multiplecards.component.html',
  styleUrls: ['./multiplecards.component.scss']
})
export class MultiplecardsComponent {
  data: IFullData = {
    id: '',
    name: '',
    list: []
  }

  ngOnInit() {
    this.data = getLastListsLS()
  }

  constructor(){
  }


  toggleCard(data: IData ){
    data.isQuestion = !data.isQuestion
  }
}
