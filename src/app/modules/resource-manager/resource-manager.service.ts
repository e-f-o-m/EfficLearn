import { inject, Injectable } from '@angular/core';
import { Group, Question2 } from 'src/app/core/models/QuestionSet';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceManagerService {
  private readonly _indexeddbService = inject(IndexeddbService);
  questions?: Question2[]
  groups?: Group[]
  question_vault_id?: number

  constructor() { }

  async deleteGroup(group_id: number): Promise<void> {
    if (group_id && (group_id == undefined || group_id == null)) { throw Error() }
    await this._indexeddbService.deleteGroup(group_id)
    this.groups = this.groups?.filter(res => res.group_id !== group_id)
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

  async setQuestionsToGroups(question_vault_id: number) {
    let questions = await this._indexeddbService.getAllQuestionByVault(question_vault_id);
    let groups = await this._indexeddbService.getAllGroupsByVault(question_vault_id);

    // Agregar grupo para preguntas sin grupo
    const emptyGroup = {
      name: 'Sin grupo',
      type: 'empty',
      questions: []
    };
    groups.data?.push(emptyGroup);

    // Crear mapa para acceso rápido a grupos por ID
    const groupMap = new Map<number, any>();
    groups.data?.forEach(group => {
      group.questions = []; // Inicializar array de preguntas
      if (group.group_id) {
        groupMap.set(group.group_id, group);
      }
    });

    // Asignar preguntas a sus grupos
    for (const question of questions.data) {
      let targetGroup;

      if (!question.group_id) {
        targetGroup = emptyGroup;
      } else {
        targetGroup = groupMap.get(question.group_id);
        // Si no encuentra el grupo, asignar al grupo vacío
        if (!targetGroup) {
          targetGroup = emptyGroup;
        }
      }

      if (targetGroup) {
        targetGroup.questions.push(question);
      }
    }

    // Ordenar preguntas en cada grupo por dificultad
    groups.data?.forEach(group => {
      if (group.questions && group.questions.length > 0) {
        group.questions.sort((a, b) => {
          // Si alguna pregunta no tiene dificultad, ponerla al final
          return (a.difficulty||0) - (b.difficulty||0);
        });
      }
    });

    this.groups = groups.data;
  }

}
