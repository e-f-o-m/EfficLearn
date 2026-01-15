import { Group, Question2, STATES_QUESTION } from "src/app/core/models/QuestionSet";



export class LogicGameCards {
  public resource!: Group[]
  public itemsSelect?: Group


  constructor(resource: Group[]) {
    this.resource = resource

    let group = this.resource[0]
    let notSelect = true; 
    for (const _group of this.resource) {
      if((new Date(_group.create_at!) > new Date(group.create_at!)) && (_group.questions?.length||0)>0 ){
        group = _group;
        notSelect = false;
      }  
    }
    if(notSelect){
      for (const _group of this.resource) {
        if((_group.questions?.length||0)>0 ){
          group = _group;
          break;
        }  
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
    itemResource.cycle = itemResource.cycle !== undefined ? itemResource.cycle + 1 : 0

    if (itemResource.difficulty! > 0) {
      //Difícil y medio
      itemResource.state = STATES_QUESTION.review
    } else if (itemResource.difficulty! === 0) {
      //Fácil
      itemResource.state = STATES_QUESTION.completed
    }
  }
}
