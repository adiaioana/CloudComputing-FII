import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import {Router, RouterModule} from '@angular/router';
import { UserDataService } from '../../../../services/user-data/user-data.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-myaccount-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './myaccount-page.component.html',
  standalone: true,
  styleUrls: ['./myaccount-page.component.css']
})
export class MyaccountPageComponent implements OnInit {
  user: any;
  reviews: any[] = [];
  username:string = '';
  email: string= '';
  reviewsLoading: boolean = false;
  reviewsError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDataService: UserDataService // Inject the service
  ) {}

  ngOnInit(): void {
    // Get the user info from the AuthService (decodes the JWT dynamically)
    this.user = this.authService.getUser();
    console.log('this is the user> ', this.user);

    this.username = this.user.username;  // Access the username
    this.email = this.user.email;        // Access the email

    this.fetchUserReviews();
  }

  fetchUserReviews(): void {
    let tok = localStorage.getItem('jwt');
    console.log(tok);
    if (tok) {  // Ensure the token is not null before decoding
      const dec: any = jwtDecode(tok);  // Decode the JWT
      console.log(dec);  // You can now access the decoded JWT payload
      let user_id = dec.sub;
      console.log('reviewsssss from ', user_id)
      if (user_id) {
        console.log('trying to get reviews');
        this.reviewsLoading = true;
        this.userDataService.getReviewsByUserId(user_id).subscribe(
          (reviews) => {
            this.reviews = reviews;
            console.log('See reviews', reviews);
            this.reviewsLoading = false;
          },
          (error) => {
            console.error('Error fetching user reviews:', error);
            this.reviewsError = true;
            this.reviewsLoading = false;
          }
        );
      }
    } else {
      console.log("No JWT found in localStorage");
    }
    return;
  }

  logout(): void {
    this.authService.logout();  // Clear the JWT token from localStorage
    this.router.navigate(['/login']);  // Redirect the user to the login page
  }

  onFileSelected(event: any): void {
    // Handle file selection here (if needed)
  }
}
