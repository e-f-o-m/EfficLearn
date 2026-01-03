import { inject, Injectable } from '@angular/core';
import { Group, Question2 } from 'src/app/core/models/QuestionSet';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceManagerService {
  private _indexeddbService = inject(IndexeddbService);
  questions?: Question2[]
  groups?: Group[]
  question_vault_id?: number

  async deleteGroup(group_id: number): Promise<void> {
    if (group_id && (group_id == undefined || group_id == null) ) { throw Error() }
    const res = await this._indexeddbService.deleteGroup(group_id)
    this.groups = this.groups?.filter(res=>res.group_id !== group_id)
  }

  async getQuestionsByVault(question_vault_id: number): Promise<void> {
    if (!question_vault_id) { throw Error() }
    const res = await this._indexeddbService.getAllQuestionByVault(question_vault_id)
    this.questions = res.data
  }

  async getGroupsByVault(question_vault_id: number): Promise<void> {
    if (!question_vault_id) { throw Error() }
    const res = await this._indexeddbService.getAllGroupsByVault(question_vault_id)
    this.groups = res.data
  }

  setQuestionsToGroups(): void {
    const posEmptyGroup = this.groups?.push({ name: 'Sin grupo', type: 'empty', questions: [] })
    this.questions?.forEach(question => {
      this.groups?.some(group => {
        if (!group.questions) { group.questions = [] }
        if(!question.group_id){
          this.groups![posEmptyGroup!-1]?.questions?.push(question)
          return true
        }
        if (question.group_id == group.group_id) {
          group?.questions?.push(question)
          return true
        }
        return false
      })
    })
  }

  constructor() { }
}
