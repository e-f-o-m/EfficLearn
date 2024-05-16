import { Component } from '@angular/core';
import grammar from './grammar';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent {
  grammar = grammar

}
