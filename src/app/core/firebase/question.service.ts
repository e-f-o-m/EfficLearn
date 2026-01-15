import { Injectable } from '@angular/core';
import { ref, set, child, push, get } from 'firebase/database';
import { db } from 'src/app/core/firebase/firebase.config';
import { Group, Question2, Question_vault } from '../models/QuestionSet';
import { FirebaseService } from './firebase.service';
import { IndexeddbService } from '../services/indexeddb/indexeddb.service';
import { LocalstorageService } from '../services/localstorange/localstorange.service';
import { ToastService } from '../services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(
    private readonly toastService: ToastService,
    private readonly firebaseService: FirebaseService,
    private readonly _indexeddbService: IndexeddbService,
    private readonly _localstorageService: LocalstorageService,
  ) {
    this._indexeddbService.rebuiltDB()
    this.saveLocalQuestions()
  }

  private async saveLocalQuestions() {
    this.firebaseService.auth$.subscribe(async (state) => {
      if (state.loading) { return; }
      if (state.user) {

        let localVersion = this._indexeddbService.getVersion()
        let cloudVersion = (this.firebaseService.getUserValue()?.last_update || 0)

        //Subir (traer de local, quitar undefined, reemplar en firebase)
        if (localVersion > cloudVersion) {
          console.log('>> >>: local to cloud', localVersion, cloudVersion);

          let questionVaultsLocal = await this._indexeddbService.getAllQuestion_vault();
          let groupsLocal = await this._indexeddbService.getAllGroups();
          let questionsLocal = await this._indexeddbService.getAllQuestion();

          let isError = false;
          try {
            await this.setVaults(questionVaultsLocal.data ? this.removeUndefined(questionVaultsLocal.data) : []);
          } catch (error) {
            isError = true;
            console.error('Error uploading vaults:', error);
            this.toastService.setToast({ title: "Error al subir vaults", type: "w", timeS: 2 });
          }
          
          try {
            await this.setGroups(groupsLocal.data ? this.removeUndefined(groupsLocal.data) : []);
          } catch (error) {
            isError = true;
            console.error('Error uploading groups:', error);
            this.toastService.setToast({ title: "Error al subir grupos", type: "w", timeS: 2 });
          }

          try {
            await this.setQuestions(questionsLocal.data ? this.removeUndefined(questionsLocal.data) : []);
          } catch (error) {
            isError = true;
            console.error('Error uploading questions:', error);
            this.toastService.setToast({ title: "Error al subir preguntas", type: "w", timeS: 2 });
          }

          this._localstorageService.setIsUpdateQuestions(false)
          if(!isError){
            this.toastService.setToast({ title: "Datos respaldados", type: "s", timeS: 2 });
            this.firebaseService.setLastVersion(localVersion);
          }
        }


        //Bajar (Traer de firebase, eliminar en local, insertar en local)
        if (localVersion < cloudVersion) {
          console.log('>> >>: cloud to local', localVersion, cloudVersion);
          try {
            await this._indexeddbService.removeVaulds()
            await this._indexeddbService.removeQuestions()
            await this._indexeddbService.removeGropus()

            let questionVaultsCloud = await this.getVaults();
            let groupsCloud = await this.getGroups();
            let questionsCloud = await this.getQuestions();

            if (questionVaultsCloud) await this._indexeddbService.upsertVaulds(questionVaultsCloud);
            if(groupsCloud) await this._indexeddbService.upsertGropus(groupsCloud);
            if (questionsCloud) await this._indexeddbService.upsertQuestions(questionsCloud);
            this._indexeddbService.setVersion(cloudVersion);
            this.toastService.setToast({ title: "Datos descargados con éxito", type: "s", timeS: 2 });

          } catch (error) {
            console.error('Error downloading:', error);
            this.toastService.setToast({ title: "Error al descargar contenido", type: "w", timeS: 2 });
          }
          this._localstorageService.setIsUpdateQuestions(false);
        } else {

          console.log('>> >>: Current',);
        }
      }
    }
    )
  }

  // -------------------------
  // 🗄️ DATABASE (Realtime DB)
  // -------------------------
  //Vault
  async insertVault(vault: Question_vault) {
    return push(ref(db, `question_system/${this.firebaseService.currentUser?.uid}/question_vault`), vault);
  }
  async setVaults(vault: Question_vault[]) {
    return set(ref(db, `question_system/${this.firebaseService.currentUser?.uid}/question_vault`), vault);
  }
  async getVaults(): Promise<Question_vault[] | null> {
    const snapshot = await get(child(ref(db), `question_system/${this.firebaseService.currentUser?.uid}/question_vault`));
    if (!snapshot.exists()) { return null; }
    const result = Object.values(snapshot.val()).filter(item => item != null);
    return result
  }

  //Groups
  async insertGroup(group: Group) {
    return push(ref(db, `question_system/${this.firebaseService.currentUser?.uid}/groups`), group);
  }
  async setGroups(group: Group[]) {
    return set(ref(db, `question_system/${this.firebaseService.currentUser?.uid}/groups`), group);
  }
  async getGroups(): Promise<Group[] | null> {
    const snapshot = await get(child(ref(db), `question_system/${this.firebaseService.currentUser?.uid}/groups`));
    if (!snapshot.exists()) { return null; }
    const result = Object.values(snapshot.val()).filter(item => item != null);
    return result
  }

  //Questions
  async insertQuestion(question: Question2) {
    return push(ref(db, `question_system/${this.firebaseService.currentUser?.uid}/questions`), question);
  }
  async setQuestions(questions: Question2[]) {
    return set(child(ref(db), `question_system/${this.firebaseService.currentUser?.uid}/questions`), questions);
  }
  async getQuestions(): Promise<Question2[] | null> {
    const snapshot = await get(child(ref(db), `question_system/${this.firebaseService.currentUser?.uid}/questions`));
    if (!snapshot.exists()) { return null; }
    const result = Object.values(snapshot.val()).filter(item => item != null);
    return result
  }

  removeUndefined(obj: any): any {
    // Si es un array, procesar cada elemento
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUndefined(item));
    }

    // Si es un objeto (pero no array, ni null)
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
      );
    }

    // Para cualquier otro tipo, devolverlo tal cual
    return obj;
  }
}
