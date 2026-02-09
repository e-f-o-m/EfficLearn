import { Component } from '@angular/core';
import grammar from './grammar';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent {
  grammar = grammar

  constructor(private route: ActivatedRoute, private viewportScroller: ViewportScroller) {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

}
