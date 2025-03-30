import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, pipe, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import axios, {AxiosHeaders, AxiosResponse} from 'axios';
@Injectable({
  providedIn: 'root',  // ✅ Keep this
})
export class AuthService {
  private apiUrl = 'http://localhost:4999/api';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; passwordUnhashed: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
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
    console.log(userData);
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt', response.token);
        }
      })
    );
  }
  getUserData(id: string): Observable<{ username: string; email: string }> {
    console.log('this is the id decoded in getUserData:', id);

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('No token available'));
    }

    // Set up headers including Authorization with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<{ username?: string; email?: string }>(
      `${this.apiUrl}/user/${id}`,
      { headers }
    ).pipe(
      map(response => ({
        username: response.username || '',
        email: response.email || ''
      })),
      tap(userdata => {
        console.log('User data processed:', userdata);
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        // Decode the token and extract user data (username, email, etc.)
        const decodedToken: any = jwt_decode.jwtDecode(token);
        console.log('decoded token info>',decodedToken);

        return this.getUserData(decodedToken.sub); // Return the decoded token (which contains the user info)
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null; // Return null if no token is found
  }
}
