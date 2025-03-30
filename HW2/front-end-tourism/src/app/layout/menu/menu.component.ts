import { Component } from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [
    MatLabel,
    MatFormField,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    RouterLink,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  constructor(public authService: AuthService) {}
}
