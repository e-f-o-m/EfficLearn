import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, QuestionSet } from '@core/models/QuestionSet';
import { getLastListsLS } from '@core/services/localstorange/LS.list';

@Component({
  selector: 'app-multiplecards',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './multiplecards.component.html',
  styleUrls: ['./multiplecards.component.scss']
})
export class MultiplecardsComponent {
  data: QuestionSet = {
    id: '',
    name: '',
    questions: []
  }

  ngOnInit() {
    this.data = getLastListsLS()
  }

  constructor(){
  }


  toggleCard(data: Question ){
    data.isStatement = !data.isStatement
  }
}
