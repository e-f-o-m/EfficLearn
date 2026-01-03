import {Injectable} from '@angular/core';
import {signInWithEmailAndPassword, User, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from 'firebase/auth';
import {ref, set, get, child, query, limitToFirst, push } from 'firebase/database';

import {auth, db} from 'src/app/core/firebase/firebase.config';
import {BehaviorSubject} from 'rxjs';
import {IUserDB} from '../models/user';

export type AuthStatus =
  | { loading: true }
  | { loading: false; user: User | null };

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  // -------------------------
  // 🔐 AUTH
  // -------------------------
  private authStatus = new BehaviorSubject<AuthStatus>({ loading: true });
  private userDB = new BehaviorSubject<IUserDB>({ userName: '', rooms: [] });
  auth$ = this.authStatus.asObservable();
  userDB$ = this.userDB.asObservable();

  constructor() {
    onAuthStateChanged(auth, (user) => {
      if(user){
        this.getUserName().then(username => {

        })
      }

      this.authStatus.next({
        loading: false,
        user: user ?? null
      });
    });
  }

  get currentUser(): User | null {
    const state = this.authStatus.value;
    return !state.loading ? state.user : null;
  }


  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  // -------------------------
  // 🗄️ DATABASE (Realtime DB)
  // -------------------------
  setData(path: string, data: any) {
    return set(ref(db, path), data);
  }

  pushData(path: string, data: any) {
    return push(ref(db, path), data);
  }

  async getSnapshot(path: string) {
    const snapshot = await get(child(ref(db), path));
    return snapshot.exists() ? snapshot : null;
  }

  async getData(path: string) {
    const snapshot = await get(child(ref(db), path));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getUserName() {
    const snapshot = await get(child(ref(db), `users/${this.currentUser?.uid}/userName`));
    this.userDB.next({
      userName: snapshot.val(),
      rooms: []
    })
    return snapshot.exists() ? snapshot.val() : null;
  }

  async setUser(userName: string) {
    return set(child(ref(db), `users/${this.currentUser?.uid}/userName`), userName);
  }



  async exist(path: string) {
    const snapshot = await get(query(ref(db, path), limitToFirst(1)));
    console.log('>> >>data exist: ', path, snapshot.val());
    return snapshot.exists();
  }

  openGoogle() {
    const providerGoogle = new GoogleAuthProvider();

    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if(!credential) throw(new Error());
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
}
