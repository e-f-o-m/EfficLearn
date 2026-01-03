import { Routes } from '@angular/router';

import { GamesComponent } from './modules/games/games.component';
import { MultiplecardsComponent } from './modules/games/multiplecards/multiplecards.component';
import { ReadComponent } from './modules/read/read.component';
import { CardsComponent } from './modules/games/cards/cards.component';
import { ContactComponent } from './modules/contact/contact.component';
import { ChatComponent } from './modules/games/chat/chat.component';
import { GrammarComponent } from './modules/grammar/grammar.component';
import MainLayoutComponent from './layouts/main-layout/main-layout.component';
import { TrivialComponent } from './modules/games/trivial/trivial.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: GamesComponent },
      { path: 'games', component: GamesComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'games/multiplecards', component: MultiplecardsComponent },
      { path: 'games/cards', component: CardsComponent },
      { path: 'games/chat', component: ChatComponent },
      { path: 'games/trivial', component: TrivialComponent },
      { path: 'grammar', component: GrammarComponent },
      { path: 'resource-manager', loadChildren: () => import('./modules/resource-manager/resource-manager.routing') },
      { path: 'read', component: ReadComponent },
    ]
  },
];
