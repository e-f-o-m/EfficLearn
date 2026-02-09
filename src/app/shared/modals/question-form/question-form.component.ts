import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Group, Question2 } from 'src/app/core/models/QuestionSet';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { InputRangeComponent } from 'src/app/shared/components/input-range/input-range.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { InputFileComponent } from "../../components/input-file/input-file.component";
import { InputSwitchComponent } from 'src/app/shared/components/input-switch/input-switch.component';
import { GroupsComponent } from '../groups/groups.component';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { getFileContent, textToQuestions } from 'src/app/core/utils/file';
import { AlertComponent, IAlert } from '../alert/alert.component';
import { nowFormatYMDHMS } from '../../date-time.utils';
import { ToastService } from 'src/app/core/services/toast/toast.service';


export interface IQuestionForm { title: string, question_vault_id: number, question?: Question2, delete?: (field: Question2) => void, accept: (field: Question2) => void, cancel: () => void, massive?: (field: Question2[]) => void }

@Component({
  selector: 'question-form',
  standalone: true,
  imports: [ButtonComponent, InputComponent, InputRangeComponent, InputFileComponent, InputSwitchComponent, GroupsComponent, TextareaComponent, AlertComponent,],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent {
  @Input() data?: IQuestionForm
  @Input() question_vault_id!: number
  isMassive = false;
  groupModal?: { question_vault_id: number, accept: (field: Group) => void, cancel: () => void }
  group?: Group
  isUpdate = false

  constructor(
    private readonly toastService: ToastService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly _indexeddbService: IndexeddbService) {
  }

  async ngOnInit() {
    this.isUpdate = this.data?.question != undefined
    if (this.data && !this.data?.question) {
      this.data.question = {
        description: '',
        entry_a: '',
        entry_b: '',
        difficulty: 2,
        tags: [],
        cycle: 0,
        question_vault_id: -1,
      }
    }

    if (this.data?.question?.group_id) {
      const groupResult = await this._indexeddbService.getGroupsById(this.data?.question?.group_id)
      if (!groupResult) return
      this.group = groupResult.data
      this.changeDetectorRef.detectChanges()
    }

  }

  alert?: IAlert
  openCreateGroups() {
    this.alert = {
      title: 'Crear grupo', input: { values: [''], id: 'name', typeFormControl: 'input-text', label: 'Nombre' },
      accept: async (newName: any) => {
        if (!newName) return
        const group: Group = {
          name: newName,
          cycle: 0,
          create_at: nowFormatYMDHMS(),
          type: '',
          question_vault_id: this.question_vault_id!
        }
        this.alert = undefined
        const data = await this._indexeddbService.insertGroup(group)
        if (!data) return

        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Grupo creado con exito!", message: ""})
      }, cancel: () => {
        this.alert = undefined
      }
    }
  }

  openGroups() {
    this.groupModal = {
      question_vault_id: this.question_vault_id!,
      accept: async (group: Group) => {
        if (!group) return
        this.group = group
        /* this.toastData = { type: 's', timeS: 1.5, title: "Pregunta creada con exito!", message: "", end: () => { this.toastData = undefined } } */
        this.groupModal = undefined
      }, cancel: () => {
        this.groupModal = undefined
      }
    }
    this.changeDetectorRef.detectChanges()
  }

  toggleMassive(event: any) {
    this.isMassive = event.checked;
  }

  deleteQuestion() {
    this.data?.delete!(this.data.question!)
  }
  cancel() {
    this.data?.cancel()
  }
  accept(event: any) {
    event.preventDefault()
    const formData = new FormData(event.target) as any;
    const fields = Object.fromEntries(formData);

    if(this.isMassive){
      const dataMasive = fields['massive_input']
      const questions = textToQuestions(dataMasive, this.data?.question_vault_id!, this.group?.group_id )
      this.data?.massive!(questions)
      return
    }

    const question: Question2 = {
      description: fields['description'],
      entry_a: fields['entry_a'],
      entry_b: fields['entry_b'],
      difficulty: (Number(fields['difficulty'])) as 0|1|2,
      cycle: Number(fields['cycle']??0),
      group_id: this.group?.group_id,
      question_vault_id: this.data?.question_vault_id!,
    }
    //Si es update
    if (this.isUpdate && this.data?.question) {
      question['question_id'] = this.data?.question.question_id
      question['tags'] = this.data?.question.tags //TODO: falta
      question['question_vault_id'] = this.data?.question.question_vault_id
    }

    this.data?.accept(question)
  }

  async onFileSelected(_files: unknown|File[]){
    const files = _files as File[]
    const content = await getFileContent(files[0])
    if(!content || !this.data?.question) return;
    if (this.data?.question) {
      this.data.question.entry_a = content;
    }
  }
}
