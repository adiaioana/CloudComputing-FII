import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttractionsService {

  constructor() { }
  searchAttractions(query: string): Promise<any[]> {
    // Assuming you already have a method to fetch attractions, you can filter them based on the query
    return fetch(`http://localhost:4999/api/attractions/search/${query}`, {
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
