import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttractionsService } from '../../../services/attraction-service/attractions.service';
import { LocationImageServiceService } from '../../../services/location-image-service/location-image-service.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-result-page-component',
  imports: [NgForOf, NgIf, RouterLink],
  standalone: true,
  templateUrl: './search-result-page-component.component.html',
  styleUrls: ['./search-result-page-component.component.css']
})
export class SearchResultPageComponentComponent implements OnInit {
  searchQuery: string = '';
  attractions: any[] = [];  // This will hold the search results
  loading: boolean = true;  // Loading state
  timeoutReached: boolean = false;  // Timeout flag
  attractionsImages: { [key: string]: string } = {};  // To store image URLs for attractions

  constructor(
    private route: ActivatedRoute,
    private attractionsService: AttractionsService,
    private locationImageService: LocationImageServiceService // Service to get the image URL for attractions
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.searchQuery = params['query'];  // Capture the search query from the URL
      this.searchAttractions();  // Perform search when component initializes
    });
  }

  searchAttractions(): void {
    // Set a timeout to simulate delay
    setTimeout(() => {
      if (this.loading) {
        this.timeoutReached = true;
        this.loading = false;  // Set loading to false if the timeout reaches
      }
    }, 5000); // Timeout after 5 seconds

    this.attractionsService.searchAttractions(this.searchQuery).then(results => {
      this.attractions = results;  // Store search results in the component
      this.loading = false;  // Set loading to false once results are fetched

      // Load image data for each attraction (only image loading part)
      this.attractions.forEach(attraction => {
        this.loadImageData(attraction.name);  // Fetch image for each attraction
      });
    }).catch(error => {
      console.error('Error searching attractions:', error);
      this.loading = false;  // Set loading to false in case of error
    });
  }

  loadImageData(attractionName: string): void {
    this.locationImageService.getImageUrl(attractionName).then(imageUrl => {
      this.attractionsImages[attractionName] = imageUrl;  // Store the image URL for each attraction
    }).catch(error => {
      console.error('Error fetching image for attraction:', error);
    });
  }
}
