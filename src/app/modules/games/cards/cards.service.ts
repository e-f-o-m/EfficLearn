import { Injectable } from "@angular/core";
import { Group, Question2 } from "src/app/core/models/QuestionSet";
import { IndexeddbService } from "src/app/core/services/indexeddb/indexeddb.service";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private _indexeddbService: IndexeddbService) {
  }

  questions?: Question2[]
  groups?: Group[]
  question_vault_id?: number

  private async getQuestionsByVault(question_vault_id: number): Promise<void> {
    if (!question_vault_id) { throw Error() }
    const res = await this._indexeddbService.getAllQuestionByVault(question_vault_id)
    /* FIXME: random quemado */
    res.data.sort(() => Math.random() - 0.5)
    this.questions = res.data
  }

  private async getGroupsByVault(question_vault_id: number): Promise<void> {
    if (!question_vault_id) { throw Error() }
    const res = await this._indexeddbService.getAllGroupsByVault(question_vault_id)
    this.groups = res.data
  }

  async setQuestionsToGroups(question_vault_id: number): Promise<void> {
    await this.getQuestionsByVault(question_vault_id)
    await this.getGroupsByVault(question_vault_id)

    const posEmptyGroup = this.groups?.push({ name: 'Sin grupo', type: 'empty', questions: [] })
    this.questions?.forEach(question => {
      this.groups?.some(group => {
        if (!group.questions) { group.questions = [] }
        if (!question.group_id) {
          this.groups![posEmptyGroup! - 1]?.questions?.push(question)
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

  async updateQuestion(question: Question2): Promise<void>{
    this._indexeddbService.updateQuestion(question)
  }

  async updateGroup(group: Group): Promise<void>{
    group.questions = undefined
    this._indexeddbService.updateGroup(group)
  }

}
