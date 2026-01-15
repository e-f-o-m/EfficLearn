import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, User, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, child, query, limitToFirst, push } from 'firebase/database';

import { auth, db } from 'src/app/core/firebase/firebase.config';
import { BehaviorSubject, take } from 'rxjs';
import { IUserDB } from '../models/user';
import { IndexeddbService } from '../services/indexeddb/indexeddb.service';

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
  private readonly authStatus = new BehaviorSubject<AuthStatus>({ loading: true });
  private readonly userDB = new BehaviorSubject<IUserDB>({ userName: '', rooms: [], last_update: null });
  auth$ = this.authStatus.asObservable();
  userDB$ = this.userDB.asObservable();

  constructor(private readonly _indexeddbService: IndexeddbService) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.getUser(user.uid).then(_user => {
          if (!_user) return
          let version = 0
          if (!_user?.last_update) {
            this.setLastVersion(0)
            _user["last_update"] = version
          }
          
          
          this.userDB.next({
            userName: _user?.userName,
            rooms: [],
            last_update: _user?.last_update
          });

          this.authStatus.next({
            loading: false,
            user: user ?? null
          });
        })
      }
    });
  }

  getUserValue() {
    return this.userDB.getValue();
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

  async getUser(uid: string) {
    if (uid == undefined) return null;
    const snapshot = await get(child(ref(db), `users/${uid}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async setUser(userName: string) {
    return set(child(ref(db), `users/${this.currentUser?.uid}/userName`), userName);
  }

  async setLastVersion(version: number) {
    return set(child(ref(db), `users/${this.currentUser?.uid}/last_update`), version);
  }



  async exist(path: string) {
    const snapshot = await get(query(ref(db, path), limitToFirst(1)));
    return snapshot.exists();
  }

  openGoogle() {
    const providerGoogle = new GoogleAuthProvider();

    providerGoogle.setCustomParameters({
        prompt: 'select_account'
    });
    
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw (new Error());
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        this._indexeddbService.setVersion(0);
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
