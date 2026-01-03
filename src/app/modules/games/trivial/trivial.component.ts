import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListResourcesComponent } from 'src/app/shared/modals/list-resources/list-resources.component';
import { Question, QuestionSet, STATES_CARD } from 'src/app/core/models/QuestionSet';
import { deleteSelectsResourceLS, getLastListsLS, getListLS, getNameListsLS, getSelectsResourceLS, insertResourceLS } from 'src/app/core/services/localstorange/LS.list';
import { speak } from 'src/app/core/services/speacking/speacking';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { LogicGameCards } from 'src/app/core/utils/LogicGameCards';
import { BtnGameComponent } from 'src/app/shared/components/btn-game/btn-game.component';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { BrPipe } from 'src/app/shared/pipes/br.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trivial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trivial.component.html',
  styleUrls: ['./trivial.component.scss']
})
export class TrivialComponent {
  data: string[] = []
  isResourse = false
  item = ''
  pos = -1
  @ViewChild("value", { static: false }) value!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(){
    const _data = localStorage.getItem('trivial')
    if(_data){
      this.data = JSON.parse(_data).sort((a:string,b:string) => a>b)
    }
  }

  next(){
    this.pos++
    if(this.pos > this.data.length){
      this.pos = 0
    }
    this.item = this.data[this.pos]
  }

  toggleResourse(){
    this.isResourse = !this.isResourse
    this.data = this.value.nativeElement.value.split('\n')
    if(this.data.length > 1){
      localStorage.setItem('trivial', JSON.stringify(this.data))
    }
  }

}
