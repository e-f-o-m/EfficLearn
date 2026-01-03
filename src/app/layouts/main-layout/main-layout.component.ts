import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import NavComponent from 'src/app/core/components/nav/nav.component';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { AlertComponent } from 'src/app/shared/modals/alert/alert.component';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavComponent, ToastComponent, AlertComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export default class MainLayoutComponent {
}
