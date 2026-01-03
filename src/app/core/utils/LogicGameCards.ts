import { Group, Question2, STATES_QUESTION } from "src/app/core/models/QuestionSet";

export class LogicGameCards {
  public resource!: Group[]
  public itemsSelect?: Group

  constructor(resource: Group[]) {
    this.resource = resource

    let group = this.resource[0]
    for (const _group of this.resource) {
      if(new Date(_group.create_at!) > new Date(group.create_at!) ){
        group = _group
      }
    }
    this.itemsSelect = group
  }

  async getData(group: Group) {
    this.itemsSelect = this.resource.find(res=>res.group_id === group.group_id)
  }

  changeCycle(cycle: number) {
    this.itemsSelect!.cycle! = cycle
  }

  setStars(itemResource: Question2) {
    itemResource.reviewCount = itemResource.reviewCount != undefined ? itemResource.reviewCount + 1 : 1
    itemResource.cycle = itemResource.cycle !== undefined ? itemResource.cycle + 1 : 0

    if (itemResource.difficulty! > 0) {
      //Difícil y medio
      itemResource.state = STATES_QUESTION.review
    } else if (itemResource.difficulty! === 0) {
      //Fácil
      itemResource.state = STATES_QUESTION.completed
    }
  }

  manualStateAndReplace(itemResource: Question2, state: string) {
    /* itemResource.state = state
    this.resource.questions?.forEach(_itemResource => {
      if (_itemResource.id === itemResource.id) {
        _itemResource.state = itemResource.state
      }
    });
    this.itemsSelect = this.itemsSelect.filter(res => res.id !== itemResource.id)
    this.validateNews() */
  }

  removeAndReplace(itemResource: Question2) {
    /* this.itemsSelect = this.itemsSelect.filter(res => res.id !== itemResource.id)
    this.resource.questions = this.resource.questions?.filter(res => res.id !== itemResource.id)
    this.validateNews() */
  }

  private validateNews() {
    //Añadir nuevos si la canitdad es menor a la designada
    /* let count = this.itemsSelect.length!

    if (count < this.resource.limit!) {
      this.resource.questions?.forEach(res => {
        if (count === this.resource.limit!) return
        if ((res.state == STATES_CARD.newDue || res.state == "" || !res.state)
          && res.state !== STATES_CARD.completed
          && res.state !== STATES_CARD.suspend
        ) {
          count++
          res.state = STATES_CARD.newDue
          res.currentCycle = this.resource.currentCycle
          res.cycle = this.resource.currentCycle
          res.difficulty = 0
          this.itemsSelect.push(res)
        }
      })
    } */
  }
}
