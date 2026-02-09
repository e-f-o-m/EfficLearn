import { Database, ref, get, child, update, push, DatabaseReference, onValue } from 'firebase/database';
import { db } from 'src/app/core/firebase/firebase.config';

export class ChatServices {
  mRef: DatabaseReference

  constructor() {
    this.mRef = ref(db, `games/chat/`);
  }

  async updateAll(events: any, idSession: string): Promise<void> {
    const mRefEvents = ref(db, `games/chat/sessions/${idSession}]`);
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
    return data;
  }

  setMessage(idSession: string, message: any) {

    push(ref(db, `games/chat/sessions/${idSession}/`), message).catch(
      (error) => {
        console.error('error :>> ', error);
      }
    );

  }
}
