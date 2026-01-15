import { Injectable } from '@angular/core';
import { Group, Question2, Question_vault, StoreGroup, StoreQuestion, StoreQuestion_vault } from 'src/app/core/models/QuestionSet';
import { LocalstorageService } from '../localstorange/localstorange.service';

export const Stores = [
  {
    tableName: 'Question',
    attributes: [
      { name: 'question_id', isUnique: true, path: 'question_id' },
      { name: 'description', isUnique: false, path: 'description' },
      { name: 'entry_a', isUnique: false, path: 'entry_a' },
      { name: 'entry_b', isUnique: false, path: 'entry_b' },
      { name: 'difficulty', isUnique: false, path: 'difficulty' },
      { name: 'tags', isUnique: false, path: 'tags' },
      { name: 'cycle', isUnique: false, path: 'cycle' },
      { name: 'create_at', isUnique: false, path: 'create_at' },
      { name: 'group_id', isUnique: false, path: 'group_id' },
      { name: 'state', isUnique: false, path: 'state' },
      { name: 'question_vault_id', isUnique: false, path: 'question_vault_id' },
      { name: 'review_count', isUnique: false, path: 'review_count' },
    ]
  },
  {
    tableName: 'Group',
    attributes: [
      { name: 'group_id', isUnique: true, path: 'group_id' },
      { name: 'name', isUnique: false, path: 'name' },
      { name: 'cycle', isUnique: false, path: 'cycle' },
      { name: 'create_at', isUnique: false, path: 'create_at' },
      { name: 'type', isUnique: false, path: 'type' },
      { name: 'question_vault_id', isUnique: false, path: 'question_vault_id' },
    ]
  },
  {
    tableName: 'Tag',
    attributes: [
      { name: 'tag_id', isUnique: true, path: 'group_id' },
      { name: 'name', isUnique: false, path: 'name' },
      { name: 'color', isUnique: false, path: 'cycle' },
    ]
  },
  {
    tableName: 'Question_vault',
    attributes: [
      { name: 'question_vault_id', isUnique: true, path: 'question_vault_id' },
      { name: 'name', isUnique: false, path: 'name' },
      { name: 'quantity', isUnique: false, path: 'quantity' },
      { name: 'completed', isUnique: false, path: 'completed' },
    ]
  }
]

export interface IStorePhoneNumbers {
  phoneNumber: string,
  unreadCount: number,
}

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {
  isOpenDB = false;
  private readonly dbName = 'local';
  private readonly dbVersion = 4;
  private db!: IDBDatabase;

  constructor(private readonly _localstorageService: LocalstorageService) {
    this.openDatabase();
  }

  openDatabase(): Promise<void> {
    // Tu lógica para abrir la base de datos indexDB
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (): void => {
        console.error('Error al abrir la base de datos.');
        reject();
      };

      request.onsuccess = (): void => {
        this.db = request.result;
        this.isOpenDB = true
        resolve();
      };

      request.onupgradeneeded = (event: any): void => {
        const db = event.target.result as IDBDatabase;


        for (const store of Stores) {
          if (db.objectStoreNames.contains(store.tableName)) {
            db.deleteObjectStore(store.tableName);
          }

          const storeOb = db.createObjectStore(store.tableName, { keyPath: store.attributes[0].path, autoIncrement: true });
          for (const attr of store.attributes) {
            storeOb.createIndex(attr.name, attr.path, { unique: attr.isUnique });
          }
        }
      };
    });

  }

  async rebuiltDB() {
    await this.openDatabase()
    const objectStoreQuestion = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const requestQuestions = objectStoreQuestion.getAll()
    const objectStoreVaults = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const requestVaults = objectStoreVaults.getAll()
    requestQuestions.onsuccess = (): void => {
      let questionsResult = requestQuestions.result
      requestVaults.onsuccess = (): void => {
        let _vaults = requestVaults.result
        let vaults =  _vaults.map(v => v.question_vault_id)
        for (const question of questionsResult) {
          if(question.animation) { 
            question.animation = undefined;
            this.updateQuestion(question.animation) 
          }
          if(!vaults.includes(question?.question_vault_id)){
            this.deleteQuestion(question.question_id)
            if(question?.group_id) { this.deleteGroup(question?.group_id) }
          }
        }
        this.db.close();
      };
    };
  }

  /* ===== Question_vault ===== */

  public async removeVaulds(): Promise<void> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    let request = objectStore.clear();
    return new Promise((resolve, reject) => { request.onsuccess = () => { this.db.close(); return resolve(); } })
  }

  public async upsertVaulds(question_vaults: Question_vault[]): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);

    return new Promise((resolve, reject) => {
      let processedCount = 0;
      const results = { inserted: 0, updated: 0, errors: 0 };

      question_vaults.forEach(question_vault => {
        const request = objectStore.put(question_vault);

        request.onsuccess = () => {
          processedCount++;
          // put devuelve la clave del registro existente si actualizó
          if (request.result === question_vault.question_vault_id) { results.updated++; } else { results.inserted++; }
          this.checkCompletion(processedCount, question_vaults.length, results, resolve);
        };

        request.onerror = () => {
          processedCount++; results.errors++;
          this.checkCompletion(processedCount, question_vaults.length, results, resolve);
        };
      });
    });
  }

  public async insertQuestion_vault(question_vault: Question_vault): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.add(this.removeUndefined(question_vault));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async getQuestion_vault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
   await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.get(question_vault_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = async (): Promise<void> => {
        this.db.close();
        const question_valut = request.result as Question_vault
        return resolve({ isError: false, data: question_valut });
      };
    }); 
  }
  
  public async getAllQuestion_vault(): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = async (): Promise<void> => {
        this.db.close();
        const question_valuts = request.result as Question_vault[]

        const isUpdate = this._localstorageService.getIsUpdateQuestions()
        if (isUpdate) {
          const allQuestions = await this.getAllQuestion()

          for (const question_valut of question_valuts) {
            question_valut.completed = 0
            question_valut.quantity = 0
            for (const question of allQuestions.data) {
              if (question.question_vault_id == question_valut.question_vault_id) {
                question_valut.completed += 1-(question.difficulty||0)/2
                question_valut.quantity++
              }
            }
            question_valut.completed = Math.floor(question_valut.completed)
            await this.updateQuestion_vault(question_valut)
          }
          this._localstorageService.setIsUpdateQuestions(false)
          console.info('>> >>  Update all question_vault:',);
        }

        return resolve({ isError: false, data: question_valuts });
      };
    });
  }

  public async updateQuestion_vault(question_vault: Question_vault): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.put(this.removeUndefined(question_vault));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion();
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async deleteQuestion_vault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.delete(question_vault_id);
    this.deleteQuestionsByVault(question_vault_id)
    this.deleteGroupsByVault(question_vault_id)
    //TODO: TAGs

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async renameQuestion_vault(question_vault_id: number, newName: string): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite').objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.get(question_vault_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        const question_vault: Question_vault = request.result;
        question_vault.name = newName;
        const updateRequest = objectStore.put(question_vault);
        updateRequest.onsuccess = () => {
          this.upVersion()
          this.db.close();
          return resolve({ isError: false, data: updateRequest.result });
        }
      };
    });
  }

  /* ===== Question ===== */
  public async removeQuestions(): Promise<void> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    let request = objectStore.clear();
    return new Promise((resolve, reject) => { request.onsuccess = () => { this.db.close(); return resolve(); } })
  }

  public async upsertQuestions(questions: Question2[]): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);

    return new Promise((resolve, reject) => {
      let processedCount = 0;
      const results = { inserted: 0, updated: 0, errors: 0 };

      questions.forEach(question => {
        // Usar put en lugar de add para insertar o actualizar

        if (question.entry_a == "" || !question.entry_a) {
          // Contar como error sin intentar la operación
          processedCount++;
          results.errors++;
          this.checkCompletion(processedCount, questions.length, results, resolve);
          return; // Salir de esta iteración
        }
        const request = objectStore.put(question);

        request.onsuccess = () => {
          processedCount++;
          // put devuelve la clave del registro existente si actualizó
          if (request.result === question.question_id) { results.updated++; } else { results.inserted++; }
          this.checkCompletion(processedCount, questions.length, results, resolve);
        };

        request.onerror = () => {
          processedCount++; results.errors++;
          this.checkCompletion(processedCount, questions.length, results, resolve);
        };
      });
    });
  }

  public async insertQuestion(question: Question2): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const request = objectStore.add(this.removeUndefined(question));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true);
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async updateQuestion(question: Question2): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    if(question.animation) { question.animation = undefined } 
    const request = objectStore.put(this.removeUndefined(question));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async deleteQuestionsByVault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.openCursor(keyRange);


    this.upVersion()
    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        const cursor = request.result;
        if (cursor) {
          objectStore.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          this.db.close();
          this._localstorageService.setIsUpdateQuestions(true)
          return resolve({ isError: false, data: request.result });
        }
      };
    });
  }

  public async deleteQuestion(question_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const request = objectStore.delete(question_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async getAllQuestion(): Promise<{ isError: boolean, data: Question2[] }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
      request.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: request.error });
      }
    })
  }

  public async getAllQuestionByVault(question_vault_id: number): Promise<{ isError: boolean, data: Question2[] }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.getAll(keyRange);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
      request.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: request.error });
      }
    })
  }

  /* ===== GROUPS ===== */
  public async removeGropus(): Promise<void> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    let request = objectStore.clear();
    return new Promise((resolve, reject) => { request.onsuccess = () => { this.db.close(); return resolve(); } })
  }

  public async upsertGropus(groups: Group[]): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);

    return new Promise((resolve, reject) => {
      let processedCount = 0;
      const results = { inserted: 0, updated: 0, errors: 0 };

      groups.forEach(group => {
        // Usar put en lugar de add para insertar o actualizar
        const request = objectStore.put(group);

        request.onsuccess = () => {
          processedCount++;
          // put devuelve la clave del registro existente si actualizó
          if (request.result === group.group_id) { results.updated++; } else { results.inserted++; }
          this.checkCompletion(processedCount, groups.length, results, resolve);
        };

        request.onerror = () => {
          processedCount++; results.errors++;
          this.checkCompletion(processedCount, groups.length, results, resolve);
        };
      });
    });
  }

  public async deleteGroupsByVault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.openCursor(keyRange);

    this.upVersion()
    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        const cursor = request.result;
        if (cursor) {
          objectStore.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          this.db.close();
          this._localstorageService.setIsUpdateQuestions(true)
          return resolve({ isError: false, data: request.result });
        }
      };
    });
  }

  public async deleteGroup(group_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(group_id);
    const request = objectStore.delete(keyRange);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        this.removeIdGroupFromQuestions(group_id);
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async deleteGroupTemp(): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase();
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const request = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      let deleted = 0;

      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          this.db.close();
          this._localstorageService.setIsUpdateQuestions(true);
          return resolve({ isError: false, data: { deleted } });
        }

        if (!cursor.value.question_vault_id) {
          objectStore.delete(cursor.primaryKey);
          deleted++;
        }
        cursor.continue();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async removeIdGroupFromQuestions(group_id: number): Promise<{ isError: boolean, data: Question2[] }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreQuestion.tableName], 'readwrite').objectStore(StoreQuestion.tableName);
    const index = objectStore.index(StoreGroup.group_id);
    const keyRange = IDBKeyRange.only(group_id);
    // Abrir un cursor con el rango clave
    const cursorRequest = index.openCursor(keyRange);

    return new Promise((resolve, reject) => {
      const results: Question2[] = [];
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;

        if (cursor) {
          let question = cursor.value as Question2
          // Actualizar el campo deseado
          question.group_id = undefined;

          // Guardar el registro actualizado
          const updateRequest = objectStore.put(question);

          updateRequest.onsuccess = function () {
            console.info(`Registro con ID ${cursor.key} actualizado.`);
          };

          updateRequest.onerror = function () {
            console.error(`Error al actualizar el registro con ID ${cursor.key}.`);
          };
        }

        // Avanzar al siguiente registro
        cursor.continue();
      };
      cursorRequest.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: [] });
      }
    })
  }

  public async getAllGroupsByVault(question_vault_id: number): Promise<{ isError: boolean, data: Group[] }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.getAll(keyRange);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
      request.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: request.error });
      }
    })
  }

  public async getAllGroups(): Promise<{ isError: boolean, data: Group[] }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
      request.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: request.error });
      }
    })
  }

  public async getGroupsById(group_id: number): Promise<{ isError: boolean, data: Group }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const request = objectStore.get(group_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
      request.onerror = (): void => {
        this.db.close();
        return reject({ isError: true, data: request.error });
      }
    })
  }

  public async updateGroup(group: Group): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    if (!group?.question_vault_id) {
      this.db.close();
      return { isError: true, data: 'Invalid group: question_vault_id', };
    }
    const request = objectStore.put(this.removeUndefined(group));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async insertGroup(group: Group): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    if (!group?.question_vault_id) {
      this.db.close();
      return { isError: true, data: 'Invalid group: question_vault_id', };
    }
    const request = objectStore.add(this.removeUndefined(group));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async renameGroup(group_id: number, newName: string): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const objectStore = this.db.transaction([StoreGroup.tableName], 'readwrite').objectStore(StoreGroup.tableName);
    const request = objectStore.get(group_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.upVersion()
        const group: Group = request.result;
        group.name = newName;
        const updateRequest = objectStore.put(group);
        updateRequest.onsuccess = () => {
          this.db.close();
          return resolve({ isError: false, data: updateRequest.result });
        }
      };
    });
  }




  /* ============================== OTHER ================================ */
  public async deleteDatabase(): Promise<void> {
    // Cerrar conexión existente si está abierta
    if (this.db) {
      this.db.close();
    }
    localStorage.clear()


    // Eliminar la base de datos
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);

      request.onsuccess = () => {
        console.log(`Base de datos ${this.dbName} eliminada`);
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error eliminando base de datos:', event);
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn('Eliminación bloqueada. Cierra otras conexiones.');
        // Puedes intentar de nuevo o notificar al usuario
        resolve(); // o reject según tu lógica
      };
    });
  }

  upVersion(): void {
    let localVersion = Number(localStorage.getItem('version') || 0)
    localStorage.setItem('version', (localVersion + 1).toString());
  }
  getVersion(): number {
    return Number(localStorage.getItem('version') || 0)
  }
  setVersion(vesion: number): void {
    localStorage.setItem('version', vesion.toString());
  }


  removeUndefined(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    );
  }

  private checkCompletion(processed: number, total: number, results: any, resolve: Function) {
    if (processed === total) {
      this.db.close();
      this.upVersion();
      this._localstorageService.setIsUpdateQuestions(true);
      resolve({
        isError: results.errors > 0,
        data: results
      });
    }
  }
}
