import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBuilderComponent } from '@shared/modals/list-builder/list-builder.component';
import { Question, QuestionSet } from '@core/models/QuestionSet';
import { getListLS, getNameListsLS } from '@core/services/localstorange/LS.list';
import { GeneralTableComponent } from '@shared/components/general-table/general-table.component';
import { GeneralTableResponse } from '@shared/components/general-table/GeneralTableResponse';
import { EditResourceComponent } from '@shared/modals/edit-resource/edit-resource.component';
import { EditItemComponent } from '@shared/modals/edit-item/edit-item.component';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { getItemResourceLS } from '@core/services/localstorange/LS.item';
import { ListResourcesComponent } from '@shared/modals/list-resources/list-resources.component';
import { LS_LISTS } from '@core/constants/constants';
import { freeVerbs } from '@core/utils/freeResource';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-library-manager',
  standalone: true,
  imports: [CommonModule,
    ListBuilderComponent,
    GeneralTableComponent,
    EditResourceComponent,
    EditItemComponent,
    InputComponent,
    ButtonComponent,
    ListResourcesComponent,
    ToastComponent
  ],
  templateUrl: './library-manager.component.html',
  styleUrls: ['./library-manager.component.scss']
})
export class LibraryManagerComponent {
  lists: QuestionSet[] = [];
  tableData: Array<Array<GeneralTableResponse>> = [];
  isEditResource = false
  isEditItem = false
  isFreeResource = false
  isTableResouces = true
  generalTableItemSelected = new GeneralTableResponse()
  dataItemResource: Question = {}
  listsResources: QuestionSet[] = []
  toastData?: {type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: ()=>void }

  ngOnInit() {
    this.listsResources = [
      {
        id: "freeVerbes1",
        name: "Free Verbs",
        description: "",
        quantity: 1,
        completed: 0,
        questions: []
      }
    ]
    this.getData()
  }

  getData() {
    this.lists = getNameListsLS()
    this.tableData = []
    for (let i = 0; i < this.lists.length; i++) {
      let temp = []
      temp.push(this.buildRow("List Name", this.lists[i].name!, this.lists[i].id!, i, this.lists[i].id!))
      temp.push(this.buildRow("Description", this.lists[i].description!, this.lists[i].id!, i, this.lists[i].id!, "hidden_responsive"))
      temp.push(this.buildRow("Quantity", this.lists[i].quantity! + "", this.lists[i].id!, i, this.lists[i].id!))
      temp.push(this.buildRow("Completed", this.lists[i].completed! + "", this.lists[i].id!, i, this.lists[i].id!))
      this.tableData.push(temp)
    }
  }
  getDataItems(resourceId: string) {
    getListLS(resourceId).then(data => {
      if (!data.questions) return
      this.tableData = []
      for (let i = 0; i < data.questions!.length; i++) {
        let temp = []
        let rangeCompleted = data.questions[i].rangeCopleted != undefined ? data.questions[i].rangeCopleted + "" : ""
        let id = data.questions[i].id ? data.questions[i].id + "" : ""
        temp.push(this.buildRow("Question", data.questions[i].statement![0], id, i, resourceId))
        temp.push(this.buildRow("Answer", data.questions[i].answer![0], id, i, resourceId))
        temp.push(this.buildRow("Range Completed", rangeCompleted, id, i, resourceId))
        this.tableData.push(temp)
      }
    })
  }

  buildRow(headerKey: string, value: string, rowId: string, posRow: number, identifierTable: string, type?: string): GeneralTableResponse {
    let gR = new GeneralTableResponse()
    gR.headerKey = headerKey
    gR.value = value
    gR.rowId = rowId
    gR.posRow = posRow
    gR.identifierTable = identifierTable
    gR.type = type
    return gR
  }

  handleClickBtnCreatList(event: any) {
    this.generalTableItemSelected = Object.assign({}, {});
    if (this.isTableResouces) {
      this.isEditResource = !this.isEditResource
    } else {
      this.isEditItem = true;
    }
  }

  rowEvent(event: any) {
    this.generalTableItemSelected = Object.assign({}, event);
    if (this.isTableResouces) {
      this.isEditResource = true;
    } else {
      this.dataItemResource = getItemResourceLS(this.generalTableItemSelected.identifierTable!, this.generalTableItemSelected.rowId!)
      this.isEditItem = true;
    }
  }

  eventActionResource(event: { action: string, object: GeneralTableResponse }) {
    
    if ("editItemsResource" == event.action) {
      this.getDataItems(event.object.rowId!)
      this.isTableResouces = false
    } else if ("deleteResource" == event.action) {
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Deleted", end: ()=>{this.toastData=undefined} }
      let auxList = this.tableData
      this.tableData = []
      for (const rows of auxList) {
        for (const col of rows) {
          if (col.rowId !== event.object.rowId) {
            this.tableData.push(rows)
            break
          }
        }
      }
    } else if ("updateResource" == event.action) {
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Updated", end: ()=>{this.toastData=undefined} }
    } else if ("insertResource" == event.action) {
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Inserted", end: ()=>{this.toastData=undefined} }
    }
    this.getData()
  }
  eventActionItemResource(event: { action: string, object: Question }) {
    if ("insertItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.rowId!)
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Inserted", end: ()=>{this.toastData=undefined} }
    } else if ("deleteItemResource" == event.action) {
      let auxList = this.tableData
      this.tableData = []
      for (const rows of auxList) {
        for (const col of rows) {
          if (col.rowId !== this.generalTableItemSelected.rowId) {
            this.tableData.push(rows)
            break
          }
        }
      }
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Deleted", end: ()=>{this.toastData=undefined} }
    } else if ("updateItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.identifierTable!)
      this.toastData = {type: 's', timeS: 1.5, title: "Successful", message: "Updated", end: ()=>{this.toastData=undefined} }
    }
  }

  handleOpenFreeResources(event: any) {
    this.isFreeResource = !this.isFreeResource
  }
  onSelectFreeResource(event: { action: string, id: string }) {
    let data = this.listsResources.find(res => res.id == event.id)
    if (!data) return
    data.questions = freeVerbs.questions
    let date = new Date().getTime()
    let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
    let startId = (date - startDate);
    data.quantity = data.questions?.length
    data.id = LS_LISTS.listResourceLanguageID + startId
    localStorage.setItem(data.id, JSON.stringify(data));
    this.getData()
  }

}
