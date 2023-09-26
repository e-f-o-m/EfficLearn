import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, IFullData } from '@core/models/IData';

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
    let local = localStorage.getItem("listSelected")

    if(local){
      this.data = JSON.parse(localStorage.getItem(local)!) 
    }
  }

  constructor(){
  }


  toggleCard(data: IData ){
    data.isQuestion = !data.isQuestion
  }
}
