import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttractionsService {

  constructor() { }
  getAttractions(): Promise<any[]> {
    return fetch('http://localhost:4999/api/attractions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => data as any[])
      .catch(error => {
        console.error('Error fetching attractions:', error);
        return [];
      });
  }

}
