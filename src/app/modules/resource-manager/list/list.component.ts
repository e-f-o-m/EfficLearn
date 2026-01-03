import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, Question2, Question_vault, QuestionSet } from 'src/app/core/models/QuestionSet';
import { GeneralTableResponse } from 'src/app/shared/components/general-table/GeneralTableResponse';
import { PorcentChartComponent } from 'src/app/shared/components/porcent-chart/porcent-chart.component';
import { AlertComponent, IAlert } from 'src/app/shared/modals/alert/alert.component';
import { IQuestionForm, QuestionFormComponent } from 'src/app/shared/modals/question-form/question-form.component';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { Router, RouterLink } from '@angular/router';
import { LocalstorageService } from 'src/app/core/services/localstorange/localstorange.service';
import { GRAMMAR_QUESTIONS } from 'src/app/core/utils/freeResource';
import { textToQuestions } from 'src/app/core/utils/file';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, PorcentChartComponent, QuestionFormComponent, AlertComponent, RouterLink
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  lists: QuestionSet[] = [];
  tableData: Array<Array<GeneralTableResponse>> = [];
  isEditResource = false
  isEditItem = false
  isFreeResource = false
  isTableResouces = true
  generalTableItemSelected = new GeneralTableResponse()
  dataItemResource: Question = {}
  listsResources: QuestionSet[] = []
  alert?: IAlert
  questionForm?: IQuestionForm
  question_vaults: Question_vault[] = []

  constructor(
    private readonly toastService: ToastService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly _indexeddbService: IndexeddbService,
    private readonly _localstorageService: LocalstorageService) {
    this.getData()
  }

  async freeResource() {
    this.alert = {
      title: 'Agregar lista de ejemplo',
      accept: async () => {
        this.alert = undefined
        const newList = await this._indexeddbService.insertQuestion_vault({ name: 'Grammar', quantity: 0, completed: 0, })
        const questions = textToQuestions(GRAMMAR_QUESTIONS, newList.data!)
        for (const question of questions) {
          const data = await this._indexeddbService.insertQuestion(question)
          if (!data) throw new Error('Error insert questions')
        }

        await this.getData()

        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Lista agregada con exito!" })

      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  async getData() {
    const data = await this._indexeddbService.getAllQuestion_vault()
    if (!data) return
    this.question_vaults = data.data;
    this._changeDetectorRef.detectChanges()
  }

  play(item?: Question_vault) {
    this._localstorageService.setQuestionVaultSelected(item?.question_vault_id!)

    const game = this._localstorageService.gameSelected
    if (game) {
      this.router.navigate([game])
    } else {
      this.router.navigate([''])
    }

  }

  add() {
    this.alert = {
      title: 'Crear lista', input: { values: [''], id: 'name', label: 'Nombre', typeFormControl: 'input-text' },
      accept: async (data: string) => {
        if (!data) return;
        this.alert = undefined;
        await this._indexeddbService.insertQuestion_vault({ name: data, quantity: 0, completed: 0, });
        await this.getData();
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Lista agregada con exito!" });
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  deleteList(item?: any) {
    this.alert = {
      title: 'Eliminar lista', message: '¿Está seguro que desea eliminar esta lista?', input: { typeFormControl: 'warn' },
      accept: async () => {
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Lista eliminada con exito!" });
        this.alert = undefined;
        const data = await this._indexeddbService.deleteQuestion_vault(item.question_vault_id);
        if (!data) return;
        await this.getData();
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  renameList(item?: Question_vault) {
    this.alert = {
      title: 'Renombrar lista', input: { values: [item?.name!], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName && item?.question_vault_id) return
        const data = await this._indexeddbService.renameQuestion_vault(item?.question_vault_id!, newName)
        if (!data) return
        this.alert = undefined
        await this.getData()
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Lista renombrada con exito!" })
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  addQuestionToList(item?: Question_vault) {
    this.questionForm = {
      title: 'Añadir pregunta',
      question_vault_id: item?.question_vault_id!,
      accept: async (question: Question2) => {
        if (!question && item?.question_vault_id) return
        const data = await this._indexeddbService.insertQuestion(question)
        if (!data) return
        this.questionForm = undefined
        await this.getData()
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta añadida con exito!" })
      }, cancel: () => {
        this.questionForm = undefined
      },
      massive: async (questions: Question2[]) => {
        for (const question of questions) {
          const data = await this._indexeddbService.insertQuestion(question)
          if (!data) throw new Error('Error insert question', data)
        }
        await this.getData()
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Preguntas añadidas con exito!" })
        this.questionForm = undefined
      }
    }
  }

}
