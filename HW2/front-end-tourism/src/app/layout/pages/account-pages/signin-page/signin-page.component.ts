import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.css'
})
export class SigninPageComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('trying')
    if (this.password !== this.password2) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      passwordUnhashed: this.password,
      role: 'User' // Default role, can be modified as needed
    };
    console.log(userData);
    this.authService.register(userData).subscribe(
      response => {
        alert('Registration successful!');
        this.router.navigate(['/log-in']);
      },
      error => {
        alert('Registration failed! Please try again.');
        console.error(error);
      }
    );
  }
}
