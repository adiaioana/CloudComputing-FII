import { Component } from '@angular/core';
import {AuthService} from '../../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-myaccount-page',
  imports: [],
  templateUrl: './myaccount-page.component.html',
  standalone: true,
  styleUrl: './myaccount-page.component.css'
})
export class MyaccountPageComponent {
  user: any;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Get the user info from the AuthService (decodes the JWT dynamically)
    this.user = this.authService.getUser();
    console.log('this is the user> ', this.user);
  }
  logout(): void {
    this.authService.logout();  // Clear the JWT token from localStorage
    this.router.navigate(['/login']);  // Redirect the user to the login page
  }
}
