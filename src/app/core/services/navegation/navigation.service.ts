import { Injectable, inject } from '@angular/core';
import { PathNavigation } from './PathNavigation';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription, filter } from 'rxjs';
/* import { NormalizeAZ09Pipe } from 'src/app/shared/pipes/normalizeAZ09.pipe';
import { pathSpanish } from 'src/app/app-routing.module'; */

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  PATH = 'path'
  /* PARAMS = 'params' */
  private pathNavigationMessage = new Subject<PathNavigation[]>();
  public pathNavigationObservable$ = this.pathNavigationMessage.asObservable();
  private router = inject(Router);
  public subscriber: Subscription;
/*   public normalizeAZ09Pipe = new NormalizeAZ09Pipe(); */

  constructor() {
    this.subscriber = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      let data = event.url.substring(0);  //delete /
      const path = data.split("?")[0] as string;
      let datax = this.router.parseUrl(data);
      let uniqueArr = Array.from(new Set(path.split("/")));
      this.setPath(uniqueArr, datax.queryParams);
    });
  }

  navegation(path: string, params?: {[key: string]: string } ){
    this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this.router.navigate([path], {queryParams: params});
    });
  }
  navegationComponent(path: string, params: {[key: string]: string } ){
      //this.router.navigate([path], {queryParams: params});
  }

  navigationPos(position: number){
    let arNavigation = this.getPath();
    let params = arNavigation.length - 1 == position? arNavigation[0].params : {};
    let path = '';
    for (let index = 0; index < arNavigation.length; index++) {
      if(index == (position+1)) break;
      path += arNavigation[index].url+"/";
    }
    path = path.slice(0, -1);

    this.navegation(path, params);
  }

  getPath(): Array<PathNavigation> {
    let pathStr = localStorage.getItem(this.PATH);
    if(!pathStr){
      return [];
    }
    return JSON.parse(pathStr) as Array<PathNavigation>;
  }

  setPath(paths: string[], _params: {[key: string]: string }){
    let arNavigation = new Array<PathNavigation>;
    paths.forEach((item: string) => {
      /* let pathNavigation = { name: pathSpanish[item], url: item, params: _params };
      arNavigation.push(pathNavigation); */
    });

    this.pathNavigationMessage.next(arNavigation)
    localStorage.setItem(this.PATH, JSON.stringify(arNavigation));
  }

}

