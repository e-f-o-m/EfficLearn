import {ChangeDetectorRef, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { FirebaseService } from '../../firebase/firebase.service';
import { AlertComponent, IAlert } from '../../../shared/modals/alert/alert.component';
import { IndexeddbService } from '../../services/indexeddb/indexeddb.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, AlertComponent ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export default class NavComponent {
  private readonly router = inject(Router);
  isNavHidden = false;
  isDark = false;
  /* themeIco = "🌞" */
  isOpenNavLeft = true;
  namePage = ""
  isLoggedIn: boolean = false;
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: () => void }
  alert?: IAlert

  constructor(
    private readonly firebaseService: FirebaseService, 
    private readonly _indexeddbService: IndexeddbService,
    private readonly _changeDetectorRef: ChangeDetectorRef) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.setStateNav(event.url)
      this.isOpenNavLeft = true
    });
    this.setStateNav(this.router.url);
  }

  ngAfterViewInit() {
    this.firebaseService.auth$.subscribe(state  => {
      if (state.loading) { return; }
      if (state.user) {
        this.isLoggedIn = true

        this.firebaseService.userDB$.subscribe(userDB => {
          if(userDB) return
          this.alert = {
            title: 'Actualizar nombre', input: { values: [''], id: 'name', label: 'Nombre de usuario', typeFormControl: 'input-text' },
            accept: async (data: string) => {
              if (!data) return
              await this.firebaseService.setUser(data)
              this.toastData = { type: 's', timeS: 1.5, title: "¡Nombre de usuairo actualizado!", message: "", end: () => {
                this.toastData = undefined
                this._changeDetectorRef.detectChanges();
              }}
              this.alert = undefined
              this._changeDetectorRef.detectChanges();
            }, cancel: () => {
              this.alert = undefined
              this._changeDetectorRef.detectChanges();
            }
          }
          this._changeDetectorRef.detectChanges();
        })
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  setStateNav(url: any) {
    let dataUrl = this.router.parseUrl(url).queryParams;
    if (dataUrl["nav"]) {
      this.isNavHidden = "false" == dataUrl["nav"]
    }
  }

  setHiddenNav() {
    this.isNavHidden = !this.isNavHidden;
    this.router.navigate([], { queryParams: { nav: this.isNavHidden } });
  }

  openLogin(){
    this.firebaseService.openGoogle()
  }

  signOut(){
    this.firebaseService.logout().then(r => {
      this._indexeddbService.deleteDatabase();
      this.router.navigate([]);
      console.log('>> >>: logout', r);
    })
  }
}
