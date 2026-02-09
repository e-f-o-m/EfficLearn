import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  setIsUpdateQuestions(isUpdate: boolean){
    localStorage.setItem('is-update-questions', isUpdate.toString())
  }
  getIsUpdateQuestions(): boolean {
    const data = localStorage.getItem('is-update-questions')
    return data === 'true'
  }
  
  get gameSelected(): string | null {
    return localStorage.getItem('game-selected')
  }
  set gameSelected(name: string) {
    localStorage.setItem('game-selected', name)
  }
 
  getGameSelected(): string|null {
    return localStorage.getItem('game-selected')
  }
  setGameSelected(name: string) {
    localStorage.setItem('game-selected', name)
  }

  getQuestionVaultSelected(): number | null {
    return Number(localStorage.getItem('question-vault-selected')) || null
  }
  setQuestionVaultSelected(question_vault_id: number) {
    localStorage.setItem('question-vault-selected', question_vault_id.toString())
  }
}