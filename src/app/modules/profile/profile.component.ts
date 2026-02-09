import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/core/firebase/firebase.service';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  isLogin = false;
  name?: string | null = null
  fechaActual = ""
  version = 0

  constructor(private readonly firebaseService: FirebaseService,
    private readonly _indexeddbService: IndexeddbService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
  ) {
    this.firebaseService.auth$.subscribe(res => {
      if (res.loading) return;
      if (!res.user) return;
      this.name = this.firebaseService.getUserValue().userName;
      this.isLogin = true;
      this.changeDetectorRef.detectChanges()
    })
  }

  ngAfterViewInit() {
    this.version = this._indexeddbService.getVersion()
    this.changeDetectorRef.detectChanges()
  }

  signOut() {
    this.firebaseService.logout().then(r => {
      this._indexeddbService.deleteDatabase();
      this.router.navigate(['']);
      console.log('>> >>: logout', r);
    })
  }

  signIn(){
    this.firebaseService.openGoogle()
  }
}
