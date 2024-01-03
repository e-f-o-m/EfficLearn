import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBuilderComponent } from '@shared/modals/list-builder/list-builder.component';
import { IData, IFullData } from '@core/models/IData';
import { getListLS, getNameListsLS } from '@core/services/localstorange/LS.list';
import { GeneralTableComponent } from '@shared/components/general-table/general-table.component';
import { GeneralTableResponse } from '@shared/components/general-table/GeneralTableResponse';
import { EditResourceComponent } from '@shared/modals/edit-resource/edit-resource.component';
import { EditItemComponent } from '@shared/modals/edit-item/edit-item.component';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { getItemResourceLS, insertItemResourceLS } from '@core/services/localstorange/LS.item';
import { ListResourcesComponent } from '@shared/modals/list-resources/list-resources.component';
import { LS_LISTS } from '@core/constants/constants';
import { freeVerbs } from '@core/utils/freeResource';

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
    ListResourcesComponent
  ],
  templateUrl: './library-manager.component.html',
  styleUrls: ['./library-manager.component.scss']
})
export class LibraryManagerComponent {
  lists: IFullData[] = [];
  tableData: Array<Array<GeneralTableResponse>> = [];
  isEditResource = false
  isEditItem = false
  isFreeResource = false
  isTableResouces = true
  generalTableItemSelected = new GeneralTableResponse()
  dataItemResource: IData = {}
  listsResources: IFullData[] = []

  ngOnInit() {
    this.listsResources = [
      {
        id: "freeVerbes1",
        name: "Free Verbs",
        description: "",
        quantity: 1,
        completed: 0,
        list: []
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
      if (!data.list) return
      this.tableData = []
      for (let i = 0; i < data.list!.length; i++) {
        let temp = []
        let rangeCompleted = data.list[i].rangeCopleted != undefined ? data.list[i].rangeCopleted + "" : ""
        let id = data.list[i].id ? data.list[i].id + "" : ""
        temp.push(this.buildRow("Question", data.list[i].question![0], id, i, resourceId))
        temp.push(this.buildRow("Answer", data.list[i].answer![0], id, i, resourceId))
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
    if (this.isTableResouces) {
      this.isEditResource = !this.isEditResource
    } else {
      this.isEditItem = true;
    }
  }

  rowEvent(event: any) {
    this.generalTableItemSelected = event
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
    }
  }
  eventActionItemResource(event: { action: string, object: IData }) {
    if ("insertItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.rowId!)
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
    } else if ("updateItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.identifierTable!)
    }
  }

  handleOpenFreeResources(event: any) {
    this.isFreeResource = !this.isFreeResource
  }
  onSelectFreeResource(event: { action: string, id: string }) {
    let data = this.listsResources.find(res => res.id == event.id)
    if (!data) return
    data.list = freeVerbs.list
    let date = new Date().getTime()
    let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
    let startId = (date - startDate);
    data.quantity = data.list?.length
    data.id = LS_LISTS.listResourceLanguageID + startId
    localStorage.setItem(data.id, JSON.stringify(data));
    this.getData()
  }

}
