import { Component, OnInit } from '@angular/core';
import { AttractionsService } from '../../../services/attraction-service/attractions.service';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LocationImageServiceService} from '../../../services/location-image-service/location-image-service.service';

@Component({
  selector: 'app-attractions-page',
  templateUrl: './attractions-page.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./attractions-page.component.css']
})

export class AttractionsPageComponent implements OnInit {
  attractions: any[] = [];
  loading: boolean = true;  // Loading state
  timeoutReached: boolean = false;  // Timeout flag
  attractionsImages: { [key: string]: string } = {};

  constructor(private attractionsService: AttractionsService, private locationImageService: LocationImageServiceService) {}

  ngOnInit(): void {
    this.fetchAttractions();
  }
  loadImagesForAttractions(): void {
    this.attractions.forEach(attraction => {
      this.locationImageService.getImageUrl(attraction.location)
        .then(imageUrl => {
          console.log('found this url ', imageUrl);
          (this.attractionsImages)[attraction.name] = imageUrl;  // Assign the image URL to the attraction
        })
        .catch(error => {
          console.error(`Error fetching image for ${attraction.name}:`, error);
        });
    });
  }

  fetchAttractions(): void {
    // Set a timeout to simulate delay
    setTimeout(() => {
      if (this.loading) {
        this.timeoutReached = true;
        this.loading = false;
      }
    }, 7000); // Timeout after 5 seconds

    this.attractionsService.getAttractions()
      .then(attractions => {
        this.attractions = attractions;
        this.loadImagesForAttractions();
        this.loading = false;  // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching attractions:', error);
        this.loading = false;
      });
  }

}

