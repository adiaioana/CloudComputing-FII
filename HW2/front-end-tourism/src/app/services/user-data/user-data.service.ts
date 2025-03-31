import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  attraction_id: string;
  id: string;
  review_score: number;
  review_text: string;
  user_id: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // Base API URL
  private apiUrl = 'http://localhost:4999/api/UserData/';

  constructor(private http: HttpClient) { }

  /**
   * Function to retrieve reviews made by a user.
   * @param userId - The ID of the user
   * @returns Observable containing the review data as JSON
   */
  getReviewsByUserId(userId: string): Observable<any> {
    const url = `${this.apiUrl}reviews-made-by-user/${userId}`;
    return this.http.get<any>(url);  // HTTP GET request
  }

  getReviewsByAttractionId(attractionId: string): Observable<any> {
    const url = `${this.apiUrl}reviews-for-attraction/${attractionId}`;
    return this.http.get<any>(url);  // HTTP GET request
  }
  postReview(review:Review){
    const url = `${this.apiUrl}review`;
    return this.http.post<any>(url,review).pipe();
  }
}
