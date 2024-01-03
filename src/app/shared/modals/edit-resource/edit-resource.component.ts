import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { GeneralTableResponse } from '@shared/components/general-table/GeneralTableResponse';
import { LS_LISTS } from '@core/constants/constants';
import { BtnImgComponent } from '@shared/components/btn-img/btn-img.component';
import { IData, IFullData } from '@core/models/IData';
import { getListLS } from '@core/services/localstorange/LS.list';

@Component({
  selector: 'edit-resource',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BtnImgComponent],
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
  resource: IFullData = {};
  data = ""
  name = ""

  constructor() {
    
  }

  ngOnChanges() {
    if (!this.generalTableResponse.rowId) return
    getListLS(this.generalTableResponse.rowId).then(res => {
      this.resource = res
      this.data = ""
      this.name = this.resource.name || ""
      
      this.resource.list?.forEach(item => {

        if (item.id != undefined) {
          this.data += `${item.id};`; this.colsActive[0].state = true
        }
        if (item.question != undefined) {
          this.data += `${item.question};`; this.colsActive[1].state = true
        }
        if (item.answer != undefined) {
          this.data += `${item.answer};`; this.colsActive[2].state = true
        }
        if (item.rangeCopleted != undefined) {
          this.data += `${item.rangeCopleted};`; this.colsActive[3].state = true
        }
        if (item.tags != undefined) {
          this.data += `${item.tags};`; this.colsActive[4].state = true
        }
        if (item.cycle != undefined) {
          this.data += `${item.cycle};`; this.colsActive[5].state = true
        }
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
    let data_editable = document.querySelector(".data_editable")!
    let name_list = document.querySelector(".name-list")! as HTMLInputElement
    let text = data_editable?.textContent
    let numColsActive = this.colsActive.reduce(function (contador, element) {
      return contador + (element.state ? 1 : 0);
    }, 0);

    if (!text) return
    let list: IData[] = []
    text.split("\n").forEach(row => {
      if (!row.trim()) return
      let item: IData = {}
      let cells = row.split(";").filter(function (elemento) { return elemento !== ""; })

      if (numColsActive != cells.length) throw new Error("La canitdad de columnas no coinciden");

      let count = 0
      if (this.colsActive[0].state) {
        item.id = cells[count]; count++;
      }
      if (this.colsActive[1].state) {
        item.question = cells[count].includes("|") ? cells[count].split("|") : [cells[count]]; count++;
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
      if(this.resource.id != undefined && this.resource.id != ""){
        item.isQuestion = true
        item.currentCycle = 0
      }
      list.push(item)
    })

    let name = name_list.value
    if (!name) throw new Error("Nombre vacio");

    if (this.resource.id == undefined || this.resource.id == "") {
      let finalData: IFullData = {
        id: '',
        name: name,
        description: '',
        limit: 10,
        quantity: list.length,
        completed: 0,
        currentCycle: 0,
        time: 30,
        list: list,
      }

      let date = new Date().getTime()
      let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
      let startId = (date - startDate);

      finalData.id = LS_LISTS.listResourceLanguageID + startId
      localStorage.setItem(finalData.id, JSON.stringify(finalData));
    }else{
      this.resource.name = name
      this.resource.list = list
      this.resource.quantity = list.length
      localStorage.setItem(this.resource.id!, JSON.stringify(this.resource));
    }
    this.toggleShow()
    //this.eventActionResource.emit("create", undefined)
  }

  reset(){
    this.resource = {}
    this.name = ""
    this.data = ""
    this.colsActive.forEach(res => {
      res.state = false;
    })
    this.colsActive[1].state = true
    this.colsActive[2].state = true
    this.generalTableResponse = {}
    this.updatePlaceholder()
  }

  handleOpenResource(event: any) {
    this.eventActionResource.emit({ action: "editItemsResource", object: this.generalTableResponse })
    this.toggleShow()
  }
  handleDeleteResource(event: any) {
    if (!this.generalTableResponse.rowId) return
    localStorage.removeItem(this.generalTableResponse.rowId)
    this.eventActionResource.emit({ action: "deleteResource", object: this.generalTableResponse })
    alert("Delete list")
    this.toggleShow()
  }

  handleSelectResource(event: any) {
    if (!this.generalTableResponse.rowId) return
    localStorage.setItem(LS_LISTS.listSelectedId, this.generalTableResponse.rowId)
    this.eventActionResource.emit({ action: "selectResource", object: this.generalTableResponse })
    alert("List Selected")
    this.toggleShow()
  }
  colsSelect(event: any) {
    if (!event.value) return
    this.colsActive[event.value].state = event.checked
    this.updatePlaceholder()
  }
}
