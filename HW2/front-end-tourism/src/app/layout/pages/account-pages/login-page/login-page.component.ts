import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  standalone: true,
  imports: [
    FormsModule, // Ensure this is imported
    RouterLink
  ],
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, passwordUnhashed: this.password }).subscribe(
      (response) => {
        this.router.navigate(['/my-account']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}
