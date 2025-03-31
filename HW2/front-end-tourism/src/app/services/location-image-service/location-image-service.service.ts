import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationImageServiceService {

  constructor() { }
  getImageUrl(location: string): Promise<string> {
    return fetch(`http://localhost:4999/api/image?location=${encodeURIComponent(location)}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    })
      .then(response => {
        console.log(`Response status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
        return data.image_url || ''; // Ensure it correctly picks the image URL key
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        return ''; // Return an empty string if there's an error
      });
  }

}
