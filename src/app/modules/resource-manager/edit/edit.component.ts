import { ChangeDetectorRef, Component } from '@angular/core';
import { Group, Question2, Question_vault } from 'src/app/core/models/QuestionSet';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { GeneralTableResponse } from 'src/app/shared/components/general-table/GeneralTableResponse';
import { AlertComponent, IAlert } from 'src/app/shared/modals/alert/alert.component';
import { IQuestionForm, QuestionFormComponent } from 'src/app/shared/modals/question-form/question-form.component';
import { ResourceManagerService } from '../resource-manager.service';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { PorcentChartComponentXs } from 'src/app/shared/components/porcent-chart/porcent-chart-xs.component';
import { AlertEditComponent, IAlertEdit } from 'src/app/shared/modals/alert-edit/alert-edit.component';
import { nowFormatYMDHMS } from 'src/app/shared/date-time.utils';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { GroupsComponent } from 'src/app/shared/modals/groups/groups.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    QuestionFormComponent, InputComponent, PorcentChartComponentXs, AlertEditComponent, AlertComponent, GroupsComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  alert?: IAlert
  alertEdit?: IAlertEdit
  questionForm?: IQuestionForm
  tableData: Array<Array<GeneralTableResponse>> = [];
  isEditResource = false
  isEditItem = false
  isFreeResource = false
  isTableResouces = true
  generalTableItemSelected = new GeneralTableResponse()
  question_vaults: Question_vault | null = null
  question_vault_id?: number
  questions?: Question2[]
  groups?: Group[]
  search = ''
  countChange = 0
  viewAll = false;
  selectedQuestions: { [key: string]: boolean } = {}
  selectedGroups: { [key: string]: boolean } = {}
  isEditMode = false;
  groupModal?: { question_vault_id: number, accept: (field: Group) => void, cancel: () => void }

  constructor(
    private readonly toastService: ToastService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly _indexeddbService: IndexeddbService,
    private readonly _resourseManegerService: ResourceManagerService) {
    this.question_vault_id = this._resourseManegerService.question_vault_id
  }


  ngOnInit() {
    this.getData()
  }

  moveToGroup() {
    this.groupModal = {
      question_vault_id: this.question_vault_id!,
      accept: async (group: Group) => {
        if (!group) return
        for (const [key, value] of Object.entries(this.selectedQuestions)) {
          if (value === true) {
            let questionUpdate = this.questions?.find(_question => _question.question_id + "" == key)
            if (questionUpdate) {
              questionUpdate.group_id = group.group_id;
              await this._indexeddbService.updateQuestion(questionUpdate);
            }
            this.selectedQuestions[key] = false;
          }
        }
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "¡Pregunta movidas con exito!", message: "" });
        this.isEditMode = false
        this.groupModal = undefined
        await this.getData();
      }, cancel: () => {
        this.groupModal = undefined
      }
    }
    this.changeDetectorRef.detectChanges()
  }

  selectQuestion(question_id?: number) {
    if (!question_id) return;
    this.selectedQuestions[question_id] = !this.selectedQuestions[question_id]
    if (!this.selectedQuestions[question_id]) {
      this.isEditMode = false;
      for (const element of Object.values(this.selectedQuestions)) {
        if (element) {
          this.isEditMode = true;
          return;
        }
      }
    } else {
      this.isEditMode = true;
    }
  }

  async getData() {
    await this._resourseManegerService.getQuestionsByVault(this._resourseManegerService.question_vault_id!);
    await this._resourseManegerService.getGroupsByVault(this._resourseManegerService.question_vault_id!);
    await this._resourseManegerService.setQuestionsToGroups(this._resourseManegerService.question_vault_id!);
    let aux = await this._indexeddbService.getQuestion_vault(this._resourseManegerService.question_vault_id!);
    if(aux?.data){
      this.question_vaults = aux.data;
    }

    this.questions = this._resourseManegerService.questions;
    this.groups = this._resourseManegerService.groups;
    this.countChange++;
    if ((this.questions?.length || 0) < 20) {
      this.viewAll = true;
    }
    this.changeDetectorRef.detectChanges();
  }

  toggleGroup(groupID: number) {
    this.selectedGroups[groupID] = !this.selectedGroups[groupID]
  }

  serach(event: string) {
    if(this.groups){
      this.groups.forEach(res=>{
        if(res.group_id != null){
          this.selectedGroups[res.group_id] = true;
        }
      })
      let posWintoutGroup = this.groups[this.groups.length-1].group_id || -1
      this.selectedGroups[posWintoutGroup] = true;
    }
    this.changeDetectorRef.detectChanges();


    this.search = event
  }

  countStars(group: Group): number {
    let easy = 0
    let normal = 0
    for (const question of group.questions ?? []) {
      if (question.difficulty == 0) {
        easy++;
      }
      if (question.difficulty == 1) {
        normal++;
      }
    }
    let sum = easy + normal / 2
    return sum
  }

  countCompleted(group: Group): number {
    let sum = 0
    for (const question of group.questions ?? []) {
      if (question.difficulty == 0) {
        sum++
      }
    }
    return sum
  }

  toggleViewAll() {
    this.viewAll = !this.viewAll
  }

  add() {
    this.questionForm = {
      title: 'Agregar pregunta',
      question_vault_id: this._resourseManegerService.question_vault_id!,
      accept: async (question: Question2) => {
        if (!question) return
        this.questionForm = undefined
        const data = await this._indexeddbService.insertQuestion(question)
        if (!data) return
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta creada con exito!", message: "" });
        await this.getData()
      }, cancel: () => {
        this.questionForm = undefined
      },
      massive: async (_questions: Question2[]) => {
        this.questionForm = undefined
        for (const question of _questions) {
          const data = await this._indexeddbService.insertQuestion(question)
          if (!data) throw new Error('Error insert questions')
        }
        await this.getData()
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "" });
      }
    }

  }

  async addGroup() {
    this.alert = {
      title: 'Crear grupo', input: { values: [''], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName) return
        const group: Group = {
          name: newName,
          cycle: 0,
          create_at: nowFormatYMDHMS(),
          type: '',
          question_vault_id: this._resourseManegerService.question_vault_id
        }
        this.alert = undefined
        const data = await this._indexeddbService.insertGroup(group)
        if (!data) return
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Grupo creado con exito!", message: "" });
        await this.getData()
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  editQuestion(question: Question2) {
    this.questionForm = {
      title: 'Editar pregunta',
      question: question,
      question_vault_id: this._resourseManegerService.question_vault_id!,
      delete: async (question: Question2) => {
        if (!question) return;
        this.questionForm = undefined;
        const data = await this._indexeddbService.deleteQuestion(question.question_id!);
        if (!data) return;
        await this.getData();
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "" });
      },
      accept: async (question: Question2) => {
        if (!question) return;
        this.questionForm = undefined;
        const data = await this._indexeddbService.updateQuestion(question);
        if (!data) return;
        await this.getData();
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta actualizada con exito!", message: "" });
      }, cancel: () => {
        this.questionForm = undefined
      },

    }
  }

  async editGroup(group: Group) {
    this.alertEdit = {
      title: 'Editar grupo', input: { values: [group.name!], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName) return
        this.alertEdit = undefined
        const data = await this._indexeddbService.renameGroup(group.group_id!, newName)
        if (!data) return
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Grupo actualizado con exito!", message: "" });

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
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Deleted" });
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
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Updated" });
    } else if ("insertResource" == event.action) {
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Inserted" });
    }
    /* this.getData() */
  }
  eventActionItemResource(event: { action: string, object: Question2 }) {
    if ("insertItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.rowId!)
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Inserted" });
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
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Deleted" });
    } else if ("updateItemResource" == event.action) {
      this.getDataItems(this.generalTableItemSelected.identifierTable!)
      this.toastService.setToast({ type: 's', timeS: 1.5, title: "Successful", message: "Updated" });
    }
  }

  exportToCsv() {
    if (!this.groups || this.groups.length === 0) {
      this.toastService.setToast({ type: 'w', timeS: 2, title: "No hay datos para exportar", message: "" });
      return;
    }

    let csvContent = 'Grupo;Entrada A;Entrada B;Descripcion;Dificultad\n';

    for (const group of this.groups) {
      if (group.questions) {
        for (const question of group.questions) {
          const row = [
            group.name || '',
            question.entry_a || '',
            question.entry_b || '',
            question.description || '',
            question.difficulty?.toString() || '0'
          ].map(val => `"${val.replace(/"/g, '""')}"`).join(';');
          csvContent += row + '\n';
        }
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `export_${this.question_vaults?.name || 'resource'}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.toastService.setToast({ type: 's', timeS: 1.5, title: "¡Exportación completada!", message: `Se ha descargado ${fileName}` });
  }

  deleteSelected() {
    this.alertEdit = {
      title: 'Eliminar preguntas', 
      message: '¿Estás seguro de que deseas eliminar las preguntas seleccionadas?', 
      accept: async () => {
        this.alertEdit = undefined;
        for (const [key, value] of Object.entries(this.selectedQuestions)) {
          if (value === true) {
            let questionDelete = this.questions?.find(_question => _question.question_id + "" == key)
            if (questionDelete) {
              await this._indexeddbService.deleteQuestion(questionDelete.question_id!)
            }
            this.selectedQuestions[key] = false;
          }
        }
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "¡Preguntas eliminadas con exito!", message: "" });
        this.isEditMode = false
        await this.getData();
      }, 
      cancel: () => {
        this.alertEdit = undefined;
      }
    }
  }

}
