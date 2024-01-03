import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export default class NavComponent {
  private router = inject(Router);
  isNavHidden = false;
  isDark = false;
  themeIco = "🌞"
  isOpenNavLeft = true;
  namePage = ""

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.setStateNav(event.url)
      this.isOpenNavLeft = true
    });
    this.setStateNav(this.router.url);
  }
  setStateNav(url: any) {
    let dataUrl = this.router.parseUrl(url).queryParams;
    if (dataUrl["nav"]) {
      this.isNavHidden = "true" == dataUrl["nav"]
    }
  }

  setHiddenNav() {
    this.isNavHidden = !this.isNavHidden;
    this.router.navigate([], { queryParams: { nav: this.isNavHidden } });
  }
}
