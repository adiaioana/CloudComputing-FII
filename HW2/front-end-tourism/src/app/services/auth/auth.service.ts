import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode'; // To decode the JWT

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:4999/api'; // Base API URL

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; passwordUnhashed: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login response:', response);
        if (response.token) {
          console.log('Setting JWT in localStorage:', response.token);
          localStorage.setItem('jwt', response.token);
          console.log('JWT after setting:', localStorage.getItem('jwt'));
        }
      })
    );
  }

  register(userData: { username: string; email: string; passwordUnhashed: string; role: string }): Observable<any> {
    console.log('Register user data:', userData);
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('jwt', response.token);
        }
      })
    );
  }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    //console.log('Getting token from localStorage:', localStorage.getItem('jwt'));
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    //console.log('Is user authenticated:', !!token);
    return !!token;
  }

  // New method to get the user from the backend
  getUser(): { email: any; username: any } {
    const token = this.getToken();

    if (!token) {
      console.log('No token found');
      return {username:'adia', email:'adiacartof@yah.com'};
    }

    // Decode the JWT to extract user ID (sub)
    const decodedToken :any = jwt_decode.jwtDecode(token);
    const userId = decodedToken.sub;

    return {username: decodedToken.username || 'adia', email: decodedToken.email || 'adiacartof@yah.com'};

   // console.log('Decoded user ID:', userId);

    // Set up the authorization header with the Bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make a GET request to fetch user details from the API
   /* return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );*/
  }
}
