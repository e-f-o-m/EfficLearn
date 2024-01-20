import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { GeneralTableResponse } from '@shared/components/general-table/GeneralTableResponse';
import { LS_LISTS } from '@core/constants/constants';
import { BtnImgComponent } from '@shared/components/btn-img/btn-img.component';
import { Question, QuestionSet } from '@core/models/QuestionSet';
import { getListLS } from '@core/services/localstorange/LS.list';
import { AlertComponent } from '../alert/alert.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'edit-resource',
  standalone: true,
  imports: [ButtonComponent, BtnImgComponent, AlertComponent, ToastComponent],
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.scss']
})
export class EditResourceComponent {
  @Input() show = false;
  @Input() generalTableResponse = new GeneralTableResponse();
  @Output() eventShow = new EventEmitter<boolean>(false);
  @Output() eventActionResource = new EventEmitter<{ action: string, object: GeneralTableResponse }>();
  colsActive = [
    { state: false, pos: 0, plHo: "id; " },
    { state: true, pos: 1, plHo: "Questions | ..; " },
    { state: true, pos: 2, plHo: "Answers |... ; " },
    { state: false, pos: 3, plHo: "0 ;" },
    { state: false, pos: 4, plHo: "Tags | ... ; " },
    { state: false, pos: 5, plHo: "0" },
  ]
  placeholderEditable: string = '';
  resource!: QuestionSet;
  data = ""

  isFormResource = true
  alertData?: { title: string, message: string, accept: () => void, cancel: () => void }
  showAlert: boolean = false;
  typeRequest!: 'create' | 'read' | 'update' | 'delete' | '';
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: () => void }

  constructor() {
    this.updatePlaceholder()
  }

  ngOnChanges() {
    this.typeRequest = 'create'
    this.resource = {
      id: '',
      name: '',
      description: '',
      limit: undefined,
      quantity: 0,
      completed: 0,
      currentCycle: 0,
      time: undefined,
      questions: [],
    }

    if (!this.generalTableResponse.rowId) return
    getListLS(this.generalTableResponse.rowId).then(res => {
      this.typeRequest = 'update'
      this.resource = res
      this.data = ""
      this.resource.description = this.resource.description || ''

      this.colsActive[0].state = true
      this.colsActive[1].state = true
      this.colsActive[2].state = true
      this.colsActive[3].state = true
      this.colsActive[4].state = true
      this.colsActive[5].state = true

      this.resource.questions?.forEach(item => {

        if (item.id != undefined) {
        }
        if (item.statement != undefined) {
        }
        if (item.answer != undefined) {
        }
        if (item.rangeCopleted != undefined) {
        }
        if (item.tags != undefined) {
        }
        if (item.cycle != undefined) {
        }
        this.data += `${item.id || ''};`;
        this.data += `${item.statement || ''};`;
        this.data += `${item.answer || ''};`;
        this.data += `${item.rangeCopleted || ''};`;
        this.data += `${item.tags || ''};`;
        this.data += `${item.cycle || ''}`;

        this.data += "\n"
      });
    })

  }

  updatePlaceholder() {
    this.placeholderEditable = '';
    this.colsActive.forEach(res => {
      if (res.state) {
        this.placeholderEditable += res.plHo
      }
    })
  }

  toggleShow() {
    this.show = !this.show;
    this.eventShow.emit(this.show)
    this.reset()
  }


  cancel(event: any) {
    this.toggleShow()
    //TODO: delete data modal
  }
  accept(event: any) {
    let data_editable = document.querySelector(".data_editable")! as HTMLPreElement
    let name_list = document.querySelector(".name_list")! as HTMLInputElement
    let _limitCycle = document.querySelector(".limit_cycle")! as HTMLInputElement
    let _automateTime = document.querySelector(".automate_time")! as HTMLInputElement
    let _description = document.querySelector(".description")! as HTMLInputElement
    let text = data_editable?.innerText

    if (name_list.value=="") {
      this.toastData = { type: 'w', timeS: 2, title: "Error", message: "Empty resource name", end: () => { this.toastData = undefined } }
      throw new Error("Enpty Name");
    }

    this.resource.name = name_list.value
    this.resource.limit = Number(_limitCycle.value) || 10
    this.resource.time =  Number(_automateTime.value) || 20
    this.resource.description = _description.value

    let numColsActive = this.colsActive.reduce(function (contador, element) {
      return contador + (element.state ? 1 : 0);
    }, 0);

    if (!text) {
      this.toastData = { type: 'w', timeS: 2, title: "Error", message: "Empty questions", end: () => { this.toastData = undefined } }
      throw new Error("Empty questions")
    }
    let list: Question[] = []
    let date = new Date().getTime()
    let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
    let startId = (date - startDate);

    text.split("\n").forEach((row, index) => {
      if (!row.trim()) return
      let item: Question = {}
      let cells = row.split(";")//.filter(function (elemento) { return elemento !== ""; })
      if (numColsActive != cells.length) {
        this.toastData = { type: 'w', timeS: 2, title: "Error", message: "Columns out of range", end: () => { this.toastData = undefined } }
        throw new Error("columns out of range: " + numColsActive + " - " + cells.length);
      }

      item.isStatement = true
      if (this.typeRequest == 'update') {
      } else {
        item.id = startId + "" + index
        item.currentCycle = 0
        item.rangeCopleted = 0
      }

      let count = 0
      if (this.colsActive[0].state) {
        item.id = cells[count]; count++;
      }
      if (this.colsActive[1].state) {
        item.statement = cells[count].includes("|") ? cells[count].split("|") : [cells[count]]; count++;
      }
      if (this.colsActive[2].state) {
        item.answer = cells[count].includes("|") ? cells[count].split("|") : [cells[count]]; count++;
      }
      if (this.colsActive[3].state) {
        item.rangeCopleted = Number(cells[count]); count++;
      }
      if (this.colsActive[4].state) {
        item.tags = cells[count].includes("|") ? cells[count].split("|") : [cells[count]]; count++;
      }
      if (this.colsActive[5].state) {
        item.cycle = Number(cells[count]);
      }

      list.push(item)
    })


    if (this.typeRequest == 'create') {
      
      let finalData: QuestionSet = {
        id: '',
        name: this.resource.name,
        description: this.resource.description,
        limit: Number(this.resource.limit),
        quantity: list.length,
        completed: 0,
        currentCycle: 0,
        time: Number(this.resource.time),
        questions: list,
      }

      finalData.id = LS_LISTS.listResourceLanguageID + startId
      localStorage.setItem(finalData.id, JSON.stringify(finalData));
      this.eventActionResource.emit({ action: "insertResource", object: this.generalTableResponse })
    } else {
      this.resource.questions = list
      this.resource.quantity = list.length
      localStorage.setItem(this.resource.id!, JSON.stringify(this.resource));
      this.eventActionResource.emit({ action: "updateResource", object: this.generalTableResponse })
    }
    this.toggleShow()
    //this.eventActionResource.emit("create", undefined)
  }

  reset() {
    this.resource = {}
    this.data = ""
    this.colsActive.forEach(res => {
      res.state = false;
    })
    this.colsActive[1].state = true
    this.colsActive[2].state = true
    this.generalTableResponse.rowId = undefined
    this.updatePlaceholder()
    this.typeRequest = ''
  }

  handleOpenResource(event: any) {
    this.eventActionResource.emit({ action: "editItemsResource", object: this.generalTableResponse })
    this.toggleShow()
  }
  handleDeleteResource(event: any) {
    this.alertData = {
      title: "Warning", message: "Are you sure you want to delete?", accept: () => {
        if (!this.generalTableResponse.rowId) return
        localStorage.removeItem(this.generalTableResponse.rowId)
        this.eventActionResource.emit({ action: "deleteResource", object: this.generalTableResponse })
        this.toggleShow()
        this.alertData = undefined
      },
      cancel: () => {
        this.alertData = undefined
      }
    }

  }

  handleSelectResource(event: any) {
    if (!this.generalTableResponse.rowId) return
    localStorage.setItem(LS_LISTS.listSelectedId, this.generalTableResponse.rowId)
    this.eventActionResource.emit({ action: "selectResource", object: this.generalTableResponse })
    //TODO: route games 
    this.toggleShow()
  }
  colsSelect(event: any) {
    if (!event.value) return
    this.colsActive[event.value].state = event.checked
    this.updatePlaceholder()
  }
}
