import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './layout/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],  // ✅ Ensure these are correct
  template: `
    <app-menu></app-menu>  <!-- ✅ Include MenuComponent -->
    <router-outlet></router-outlet>   <!-- ✅ Ensure RouterOutlet is present -->
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front-end-tourism';
}
