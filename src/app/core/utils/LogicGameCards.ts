import { Question, QuestionSet, STATES_CARD } from "@core/models/QuestionSet";
import { insertResourceLS, insertSelectsResourceLS } from "@core/services/localstorange/LS.list";

export class LogicGameCards {
  public resource!: QuestionSet
  public itemsSelect: Question[] = []

  constructor() {
  }
  
  async getData(resource: QuestionSet){
    this.resource = resource
    //Buscar los del ciclo actual
    //TODO: Temporal
    /* if (this.resource.list!.length > 0) {
      if (!this.resource.list![0].id) {
        for (let i = 0; i < this.resource.list!.length; i++) {
          this.resource.list![i].id = "" + i
          this.resource.list![i].reviewCount = 0
        }
      }
    } */

    //TODO limit default?
    if(!this.resource.questions) return
    let tempLimit = this.resource.questions.length > 5? 5: this.resource.questions?.length   
    this.resource.limit = this.resource.limit? this.resource.limit: tempLimit
    this.resource.currentCycle = this.resource.currentCycle? this.resource.currentCycle: 0
  
    let auxItemsSelect = this.resource.questions?.filter(res => {
      if ((res.currentCycle == this.resource.currentCycle
        && this.resource.currentCycle != 0
        && this.resource.currentCycle
        && res.state
      )
        && res.state !== STATES_CARD.completed
        && res.state !== STATES_CARD.suspend
      ) {
        return true
      }
      return false
    })
    //Si es primera vez el quality serán todos los items que faltan a continuación
  
    if (!auxItemsSelect) return
    this.itemsSelect = auxItemsSelect
  
    this.validateNews()

  }

  async changeCycle(cycle: number): Promise<string> {
    let auxItemsSelect = []

    for (let j = 0; j < this.itemsSelect.length; j++) {
      if (this.itemsSelect[j].state == STATES_CARD.newDue ||
        this.itemsSelect[j].state == STATES_CARD.repeatDue
      ) {
        throw new Error("Error due");
      }
    }

    for (let i = 0; i < this.resource.questions!.length; i++) {
      //Guadar (lista) item de lita actual en recurso
      for (let j = 0; j < this.itemsSelect.length; j++) {
        if (this.resource.questions![i].id === this.itemsSelect[j].id) {
          if (this.itemsSelect[j].state == STATES_CARD.newReview) {
            this.itemsSelect[j].state = STATES_CARD.repeatDue
          } else if (this.itemsSelect[j].state == STATES_CARD.repeatReview) {
            this.itemsSelect[j].state = STATES_CARD.repeatDue
          }
          this.resource.questions![i] = this.itemsSelect[j]
        }
      }

      //buscar los items del recurso que coincidan con el nuevo ciclo
      //cambiar currentcycle de los items nuevos, añadir item a arraytemporal
      if (this.resource.questions![i].cycle == cycle
        && this.resource.questions![i].state !== STATES_CARD.completed
        && this.resource.questions![i].state !== STATES_CARD.suspend
      ) {
        this.resource.questions![i].currentCycle = cycle
        auxItemsSelect.push(this.resource.questions![i])
      }
    }

    //Guardar
    this.resource.currentCycle = cycle
    await insertResourceLS(this.resource)

    if (!auxItemsSelect) throw new Error("Error auxitemsselectnews");

    this.itemsSelect = auxItemsSelect
    this.validateNews()
    return "complet"
  }

  setStars(itemResource: Question) {
    itemResource.reviewCount = itemResource.reviewCount!=undefined? itemResource.reviewCount+1: 1

    itemResource.cycle = itemResource.cycle!==undefined ? itemResource.cycle : 0
    itemResource.currentCycle = itemResource.currentCycle!==undefined? itemResource.currentCycle : 0
    if (itemResource.rangeCopleted! < 2) {
      //difícil
      itemResource.cycle = itemResource.currentCycle! + 1
    } else if (itemResource.rangeCopleted! === 2 || itemResource.rangeCopleted! === 3) {
      //medio
      itemResource.cycle = itemResource.currentCycle! + 2
    } else if (itemResource.rangeCopleted! === 4 || itemResource.rangeCopleted! === 5) {
      //Fácil
      itemResource.cycle = itemResource.currentCycle! + 3
      //Luego de volver a jugar un item macado como facil en un ciclo anterior pasa a completado 
      if (itemResource.state == STATES_CARD.repeatReview) {
        itemResource.state = STATES_CARD.completed
        this.manualStateAndReplace(itemResource, STATES_CARD.completed)
      }
    }
    if (itemResource.state == STATES_CARD.newDue) {
      itemResource.state = STATES_CARD.newReview
    } else if (itemResource.state == STATES_CARD.repeatDue) {
      itemResource.state = STATES_CARD.repeatReview
    }

    this.itemsSelect.forEach(res => {
      if (res.id == itemResource.id) {
        res = itemResource
        return
      }
    })


    const temp: QuestionSet = {}
    temp.id = this.resource.id
    temp.name = this.resource.name
    temp.description = this.resource.description
    temp.quantity = this.resource.quantity
    temp.completed = this.resource.completed
    temp.currentCycle = this.resource.currentCycle
    temp.time = this.resource.time
    temp.questions = this.itemsSelect
    insertSelectsResourceLS(temp)
  }

  manualStateAndReplace(itemResource: Question, state: string){    
    itemResource.state = state
    this.resource.questions?.forEach(_itemResource => {
      if(_itemResource.id === itemResource.id){
        _itemResource.state = itemResource.state
      }
    });
    this.itemsSelect = this.itemsSelect.filter(res=>res.id!==itemResource.id) 
    this.validateNews()
  }
  
  removeAndReplace(itemResource:Question){
    this.itemsSelect = this.itemsSelect.filter(res=>res.id!==itemResource.id) 
    this.resource.questions = this.resource.questions?.filter(res=>res.id!==itemResource.id) 
    this.validateNews()
  }

  private validateNews() {
    //Añadir nuevos si la canitdad es menor a la designada
    let count = this.itemsSelect.length!
    
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
          res.rangeCopleted = 0
          this.itemsSelect.push(res)
        }
      })
    }
  }
}
