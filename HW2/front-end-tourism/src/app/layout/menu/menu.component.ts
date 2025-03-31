import { Component } from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [
    MatLabel,
    MatFormField,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  searchQuery: string = '';
  constructor(public authService: AuthService, private router: Router) {}
  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Redirect to the search results page with the search query
      this.router.navigate(['/search', this.searchQuery]);
    }
  }
}
