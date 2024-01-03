import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tempData } from '@core/utils/freeResource';
import { LogicGameCards } from '@core/utils/LogicGameCards';
import { deleteSelectsResourceLS, getSelectsResourceLS, insertResourceLS } from '@core/services/localstorange/LS.list';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  logicGameCard!: LogicGameCards
  stars = 0
  poscard = 0


  ngAfterViewInit() {
    getSelectsResourceLS().then(res => {
      res.list?.forEach(_itemSelect => {
        tempData.list?.forEach(_itemResource => {
          if (_itemResource.id == _itemSelect.id) {
            _itemResource = _itemSelect
            return
          }
        })
      });
      insertResourceLS(tempData)
      deleteSelectsResourceLS()
      this.logicGameCard = new LogicGameCards(tempData)
    }).catch(res => {
      this.logicGameCard = new LogicGameCards(tempData)
    }).finally(() => {
      document.querySelector(".data")!.innerHTML = JSON.stringify(this.logicGameCard.itemsSelect, null, 2)
    })
  }


  setStars(stars: number) {
    this.stars = stars
  }
  setPosCard(poscard: number) {
    this.poscard = poscard
  }

  next() {
    this.logicGameCard.itemsSelect[this.poscard].rangeCopleted = this.stars
    this.logicGameCard.setStars(this.logicGameCard.itemsSelect[this.poscard])
    document.querySelector(".data")!.innerHTML = JSON.stringify(this.logicGameCard.itemsSelect, null, 1)
  }

  cicle() {
    this.logicGameCard.changeCycle(this.logicGameCard.resource.currentCycle! + 1).then(res => {
      document.querySelector(".data")!.innerHTML = JSON.stringify(this.logicGameCard.itemsSelect, null, 1)
    }).catch(error => {
      console.log('>> >>  errror:', error);
    })
  }
}
