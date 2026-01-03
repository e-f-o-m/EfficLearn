import { ChangeDetectorRef, Component } from '@angular/core';
import { Group, Question, Question2, Question_vault, QuestionSet } from 'src/app/core/models/QuestionSet';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { GeneralTableResponse } from 'src/app/shared/components/general-table/GeneralTableResponse';
import { AlertComponent, IAlert } from 'src/app/shared/modals/alert/alert.component';
import { IQuestionForm, QuestionFormComponent } from 'src/app/shared/modals/question-form/question-form.component';
import { ResourceManagerService } from '../resource-manager.service';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { PorcentChartComponentXs } from 'src/app/shared/components/porcent-chart/porcent-chart-xs.component';
import { AlertEditComponent, IAlertEdit } from 'src/app/shared/modals/alert-edit/alert-edit.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    QuestionFormComponent,
    InputComponent, PorcentChartComponentXs, AlertEditComponent, AlertComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: () => void }
  alert?: IAlert
  alertEdit?: IAlertEdit
  questionForm?: IQuestionForm
  tableData: Array<Array<GeneralTableResponse>> = [];
  isEditResource = false
  isEditItem = false
  isFreeResource = false
  isTableResouces = true
  generalTableItemSelected = new GeneralTableResponse()
  listsResources: QuestionSet[] = []
  question_vaults: Question_vault[] = []
  dataItemResource: Question  = {}
  question_vault_id?: number

  questions?: Question2[]
  groups?: Group[]
  search = ''

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef, 
    private readonly _indexeddbService: IndexeddbService, 
    private readonly _resourseManegerService: ResourceManagerService) {
    this.questions = this._resourseManegerService.questions
    this.groups = this._resourseManegerService.groups
    this.question_vault_id = this._resourseManegerService.question_vault_id
  }


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

  async getData() {
    await this._resourseManegerService.getQuestionsByVault(this._resourseManegerService.question_vault_id!)
    await this._resourseManegerService.getGroupsByVault(this._resourseManegerService.question_vault_id!)
    this._resourseManegerService.setQuestionsToGroups()
    this.questions = this._resourseManegerService.questions
    this.groups = this._resourseManegerService.groups
    this.changeDetectorRef.detectChanges()
  }

  serach(event: any){
    this.search = event
  }

  countStars(group: Group): number {
    let sum = 0
    for (const question of group.questions??[]) {
      sum += Number(question.difficulty!)
    }
    return sum
  }

  add(){
    this.questionForm = {
      title: 'Agregar pregunta',
      question_vault_id: this._resourseManegerService.question_vault_id!,
      accept: async (question: Question2) => {
        if (!question) return
        this.questionForm = undefined
        const data = await this._indexeddbService.insertQuestion(question)
        if (!data) return
        this.toastData = { type: 's', timeS: 1.5, title: "Pregunta creada con exito!", message: "", end: () => { this.toastData = undefined } }
        await this.getData()
      }, cancel: () => {
        this.questionForm = undefined
      },
      massive: async (questions: Question2[]) => {
        console.log('>> >>: question', questions);
        this.questionForm = undefined
        for (const question of questions) {
          const data = await this._indexeddbService.insertQuestion(question)
          if (!data) throw new Error('Error insert questions')
        }
        await this.getData()
        this.toastData = { type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "", end: () => { this.toastData = undefined } }
      }
    }

  }

  async addGroup(){
    this.alert = {
      title: 'Crear grupo', input: { values: [''], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName) return
        const group: Group = {
          name: newName,
          cycle: 0,
          create_at: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' '),
          type: '',
          question_vault_id: this._resourseManegerService.question_vault_id
        }
        this.alert = undefined
        const data = await this._indexeddbService.insertGroup(group)
        if (!data) return
        this.toastData = { type: 's', timeS: 1.5, title: "Grupo creado con exito!", message: "", end: () => { this.toastData = undefined } }
        await this.getData()
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  editQuestion(question: Question2){
    this.questionForm = {
      title: 'Editar pregunta',
      question: question,
      question_vault_id: this._resourseManegerService.question_vault_id!,
      delete: async (question: Question2) => {
        if (!question) return
        this.questionForm = undefined
        const data = await this._indexeddbService.deleteQuestion(question.question_id!)
        if (!data) return
        await this.getData()
        this.toastData = { type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "", end: () => { this.toastData = undefined } }
      },
      accept: async (question: Question2) => {
        if (!question) return
        this.questionForm = undefined
        const data = await this._indexeddbService.updateQuestion(question)
        if (!data) return
        await this.getData()
        this.toastData = { type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "", end: () => { this.toastData = undefined } }
      }, cancel: () => {
        this.questionForm = undefined
      },

    }
  }

  async editGroup(group: Group){
    this.alertEdit = {
      title: 'Editar grupo', input: { values: [group.name!], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName) return
        this.alertEdit = undefined
        const data = await this._indexeddbService.renameGroup(group.group_id!, newName)
        if (!data) return
        this.toastData = { type: 's', timeS: 1.5, title: "Grupo actualizado con exito!", message: "", end: () => { this.toastData = undefined } }

        await this.getData()
      }, cancel: () => {
        this.alertEdit = undefined
      }, delete: async () => {
        this.alertEdit = undefined
        await this._resourseManegerService.deleteGroup(group.group_id!)
        await this.getData()
      }
    }
  }

  getDataItems(resourceId: string) {
    /* getListLS(resourceId).then(data => {
      if (!data.questions) return
      this.tableData = []
    }) */
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
      /* this.dataItemResource = getItemResourceLS(this.generalTableItemSelected.identifierTable!, this.generalTableItemSelected.rowId!) */
      this.isEditItem = true;
    }
  }

  eventActionResource(event: { action: string, object: GeneralTableResponse }) {

    if ("editItemsResource" == event.action) {
      this.getDataItems(event.object.rowId!)
      this.isTableResouces = false
    } else if ("deleteResource" == event.action) {
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Deleted", end: () => { this.toastData = undefined } }
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
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Updated", end: () => { this.toastData = undefined } }
    } else if ("insertResource" == event.action) {
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Inserted", end: () => { this.toastData = undefined } }
    }
    /* this.getData() */
  }
  eventActionItemResource(event: { action: string, object: Question }) {
    if ("insertItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.rowId!)
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Inserted", end: () => { this.toastData = undefined } }
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
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Deleted", end: () => { this.toastData = undefined } }
    } else if ("updateItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.identifierTable!)
      this.toastData = { type: 's', timeS: 1.5, title: "Successful", message: "Updated", end: () => { this.toastData = undefined } }
    }
  }
}
