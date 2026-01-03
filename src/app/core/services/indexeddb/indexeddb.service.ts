import { Injectable } from '@angular/core';
import { Group, Question, Question2, Question_vault, StoreGroup, StoreQuestion, StoreQuestion_vault } from 'src/app/core/models/QuestionSet';
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
  private dbName = 'local';
  private dbVersion = 4;
  private db!: IDBDatabase;

  constructor(private _localstorageService: LocalstorageService) {
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

  /* ===== Question_vault ===== */

  public async insertQuestion_vault(question_vault: Question_vault): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.add(this.removeUndefined(question_vault));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async getAllQuestion_vault(): Promise<{ isError: boolean, data: any }> {

    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion_vault.tableName);
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
                question_valut.completed += question.difficulty == 0 ? 1 : 0
                question_valut.quantity++
              }
            }
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
    const transaction = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.put(this.removeUndefined(question_vault));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }


  public async deleteQuestion_vault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.delete(question_vault_id);
    this.deleteQuestionsByVault(question_vault_id)
    this.deleteGroupsByVault(question_vault_id)
    //TODO: TAGs

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async renameQuestion_vault(question_vault_id: number, newName: string): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion_vault.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion_vault.tableName);
    const request = objectStore.get(question_vault_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        const question_vault: Question_vault = request.result;
        question_vault.name = newName;
        const updateRequest = objectStore.put(question_vault);
        updateRequest.onsuccess = () => {
          this.db.close();
          return resolve({ isError: false, data: updateRequest.result });
        }
      };
    });
  }

  /* ===== Question ===== */

  public async insertQuestion(question: Question): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
    const request = objectStore.add(this.removeUndefined(question));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async updateQuestion(question: Question): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
    const request = objectStore.put(this.removeUndefined(question));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async deleteQuestionsByVault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.openCursor(keyRange);

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
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
    const request = objectStore.delete(question_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async getAllQuestion(): Promise<{ isError: boolean, data: Question2[] }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
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
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
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

  public async deleteGroupsByVault(question_vault_id: number): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(question_vault_id);
    const request = index.openCursor(keyRange);

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
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
    const index = objectStore.index('question_vault_id');
    const keyRange = IDBKeyRange.only(group_id);
    const request = objectStore.delete(keyRange);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        this.removeIdGroupFromQuestions(group_id);
        this._localstorageService.setIsUpdateQuestions(true)
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  private async removeIdGroupFromQuestions(group_id: number): Promise<{ isError: boolean, data: Question2[] }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreQuestion.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreQuestion.tableName);
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
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
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

  public async getGroupsById(group_id: number): Promise<{ isError: boolean, data: Group }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
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
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
    const request = objectStore.put(this.removeUndefined(group));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async insertGroup(group: Group): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
    const request = objectStore.add(this.removeUndefined(group));

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
        this.db.close();
        return resolve({ isError: false, data: request.result });
      };
    });
  }

  public async renameGroup(group_id: number, newName: string): Promise<{ isError: boolean, data: any }> {
    await this.openDatabase()
    const transaction = this.db.transaction([StoreGroup.tableName], 'readwrite');
    const objectStore = transaction.objectStore(StoreGroup.tableName);
    const request = objectStore.get(group_id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (): void => {
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

  /* public getAllPhoneNumber(): Observable<IStorePhoneNumbers[]> {
    const transaction = this.db.transaction([StorePhoneNumbers.PhoneNumbers], 'readwrite');
    const objectStore = transaction.objectStore(StorePhoneNumbers.PhoneNumbers);
    const request = objectStore.getAll();

    return new Observable((observer) => {
      request.onsuccess = (): void => {
        const cliente = request.result as IStorePhoneNumbers[];
        if(cliente.length>0){
          observer.next(cliente);
        }else{
          observer.next([]);
        }
        observer.complete();
      };
    });
  }
  public setAllPhoneNumber(storePhoneNumbers: IStorePhoneNumbers[]): Observable<any> {
    const transaction = this.db.transaction([StorePhoneNumbers.PhoneNumbers], 'readwrite');
    const objectStore = transaction.objectStore(StorePhoneNumbers.PhoneNumbers);

    objectStore.clear()
    storePhoneNumbers.forEach((res) => {
      objectStore.put(res);
    })
    return new Observable((observer) => {
      observer.next();
      observer.complete();
      request.onsuccess = (event: any): void => {
        observer.next(event);
        observer.complete();
      };

      request.onerror = (event: any): void => {
        console.error('Error al actualizar el Numero.');
        observer.error(event);
      };
    });

  }

  public updatePhoneNumber(phoneNumber: any): Observable<any> {
    const transaction = this.db.transaction([StorePhoneNumbers.PhoneNumbers], 'readwrite');
    const objectStore = transaction.objectStore(StorePhoneNumbers.PhoneNumbers);
    const request = objectStore.put(phoneNumber);

    return new Observable((observer) => {
      request.onsuccess = (event: any): void => {
        observer.next(event);
        observer.complete();
      };

      request.onerror = (event: any): void => {
        console.error('Error al actualizar el Numero.');
        observer.error(event);
      };
    });
  }

  public deletePhoneNumber(phoneNumber: string): Observable<any> {
    const transaction = this.db.transaction([StorePhoneNumbers.PhoneNumbers], 'readwrite');
    const objectStore = transaction.objectStore(StorePhoneNumbers.PhoneNumbers);
    const phoneNumberIndex = objectStore.index(StoreConversation.numberPhone);
    const request = phoneNumberIndex.openCursor(phoneNumber);

    return new Observable((observer) => {
      request.onsuccess = (): void => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }else{
          observer.next();
          observer.complete();
        }
      };

      request.onerror = (event: any): void => {
        console.error('Error al eliminar el numero.');
        observer.error(event);
      };
    });
  } */

  removeUndefined(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    );
  }
}
