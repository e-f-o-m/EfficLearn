import { Database, ref, get, child, update, push, DatabaseReference, onValue } from '@angular/fire/database';

export class ChatServices {
  mRef: DatabaseReference

  constructor(private db: Database) {
    this.mRef = ref(this.db, `games/chat/`);
  }

  async updateAll(events: any, idSession: string): Promise<void> {
    const mRefEvents = ref(this.db, `games/chat/sessions/${idSession}]`);
    await update(mRefEvents, events);
    return Promise.resolve();
  }

  async getAll(idSession: string): Promise<any[]> {
    let data: any[]= []

    await get(child(this.mRef, `sessions/${idSession}/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((_event) => {
            let item: any = _event.val() as {text: string, user: string};
            data.push(item); 
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

      console.log('>> >>  data que llegar:', data);
    return data;
  }

  setMessage(idSession: string, message: any) {
    
    push(ref(this.db, `games/chat/sessions/${idSession}/`), message).catch(
      (error) => {
        console.log('error :>> ', error);
      }
    );

  }
}
