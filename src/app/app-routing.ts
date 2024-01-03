import { Routes } from '@angular/router';
import { GamesComponent } from '@modules/games/games.component';
import { LibraryManagerComponent } from '@modules/library-manager/library-manager.component';
import { MultiplecardsComponent } from '@modules/games/multiplecards/multiplecards.component';
import { ReadComponent } from '@modules/read/read.component';
import MainLayoutComponent from '@shared/layouts/main-layout/main-layout.component';
import { CardsComponent } from '@modules/games/cards/cards.component';
import { ContactComponent } from '@modules/contact/contact.component';
import { TestComponent } from '@modules/test/test.component';
import { ChatComponent } from '@modules/games/chat/chat.component';

export const mroutes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: '', component: GamesComponent },
        { path: 'test', component: TestComponent },
        { path: 'games', component: GamesComponent },
        { path: 'contact', component: ContactComponent },
        { path: 'games/multiplecards', component: MultiplecardsComponent },
        { path: 'games/cards', component: CardsComponent },
        { path: 'games/chat', component: ChatComponent },
        { path: 'library-manager', component: LibraryManagerComponent },
        { path: 'read', component: ReadComponent },
      ]
      /* component: SkeletonComponent,
      children: [
        { path: 'home', component: SkeletonComponent },
        { path: 'test', loadComponent: () => import('@modules/test/test.component').then(m => m.TestComponent) },
        { path: 'settings', loadChildren: () => ROUTE_SETTINGS },
        { path: 'fillcard', loadComponent: () => import('@modules/fill-card/fill-card.component').then(m => m.FillCardComponent) },
        { path: 'dashboard', loadChildren: () => ROUTE_DASHBOARD },
      ] */
    },
  ];

  
/* import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } */
