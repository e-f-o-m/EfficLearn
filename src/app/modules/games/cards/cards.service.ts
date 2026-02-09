import { Injectable } from "@angular/core";
import { Group, Question2 } from "src/app/core/models/QuestionSet";
import { IndexeddbService } from "src/app/core/services/indexeddb/indexeddb.service";

export enum EModes {
  thisGroup = 'Este grupo',
  onlyHard = 'Solo difíciles',
  onlyMedium = 'Solo medios',
  onlyEasy = 'Solo fáciles',
  everything = 'Todo',
  onlyHardGroups = 'Solo grupos difíciles',
  onlyMediumGroups = 'Solo grupos medios',
  onlyEasyGroups = 'Solo grupos fáciles',
  top10LargestCycles = 'Top 10 mayores ciclos',
  top20LargestCycles = 'Top 20 mayores ciclos'
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  //questions: Question2[] = []
  groups: Group[] = [];
  question_vault_id: number | null = null;
  currentGroupPos: number | null = null;
  mode: string | null = null;
  
  constructor(private readonly _indexeddbService: IndexeddbService) {
  }

  /* LOGIC */
  changeMode(mode: EModes){
    this.mode = mode
  }


  /* REQUEST */

  async setQuestionsToGroups(question_vault_id: number): Promise<void> {
    this.mode = EModes.thisGroup
    let questions = await this._indexeddbService.getAllQuestionByVault(question_vault_id)
    let groups = await this._indexeddbService.getAllGroupsByVault(question_vault_id)

    const posEmptyGroup = groups.data?.push({ name: 'Sin grupo', type: 'empty', questions: [] })
    questionsLoop: for (const question of questions.data) {
      groupsLoop: for (const group of groups.data) {
        if (!group.questions) { group.questions = [] }
        if (!question.group_id) {
          groups.data[posEmptyGroup! - 1]?.questions?.push(question)
          continue questionsLoop;
        }
        if (question.group_id == group.group_id) {
          group?.questions?.push(question)
          continue questionsLoop;
        }
        continue groupsLoop;
      }
    }
    this.currentGroupPos = 0;//groups.data.length - 1; 
    this.groups = groups.data;
  }

  setPosGroup(idGroup?: number): void {
    this.currentGroupPos = this.groups.findIndex(res=>res.group_id == idGroup);
  }

  getCurrentGroup(): Group | null {
    if(this.currentGroupPos == null) return null;
    return this.groups[this.currentGroupPos];
  }

  nextGroup(): Group {
    this.currentGroupPos ??= 0;;
    this.currentGroupPos++;
    if(this.currentGroupPos > this.groups.length-1){
      this.currentGroupPos = 0;
    }
    let group = this.groups[this.currentGroupPos];
    return group;
  }

  async updateQuestion(question: Question2): Promise<void>{
    this._indexeddbService.updateQuestion(question)
  }

  //TODO 1 clase updateGroup
  async updateGroup(group: Group): Promise<void>{
    group.questions = undefined
    this._indexeddbService.updateGroup(group)
  }

}
