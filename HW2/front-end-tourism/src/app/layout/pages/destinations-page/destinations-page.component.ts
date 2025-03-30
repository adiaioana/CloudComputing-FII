import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AttractionsService} from '../../../services/attraction-service/attractions.service';

@Component({
  selector: 'app-destinations-page',
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './destinations-page.component.html',
  standalone: true,
  styleUrl: './destinations-page.component.css'
})
export class DestinationsPageComponent implements OnInit {
  attractions: any[] = [];
  loading: boolean = true;  // Loading state
  timeoutReached: boolean = false;  // Timeout flag
  distinctLocations: any[] = [];
  constructor(private attractionsService: AttractionsService) {}

  ngOnInit(): void {
    this.fetchLocations();
  }
  fetchAttractions(): void {
    // Set a timeout to simulate delay
    setTimeout(() => {
      if (this.loading) {
        this.timeoutReached = true;
        this.loading = false;
      }
    }, 5000); // Timeout after 5 seconds

    this.attractionsService.getAttractions()
      .then(attractions => {
        this.attractions = attractions;
        this.loading = false;  // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching attractions:', error);
        this.loading = false;
      });
  }
  fetchLocations(): void {
    this.fetchAttractions(); // Start fetching attractions

    this.attractionsService.getAttractions()
      .then(attractions => {
        this.attractions = attractions;
        const locations = new Set<string>();

        this.attractions.forEach(attraction => {
          if (attraction.location) {
            locations.add(attraction.location);
          }
        });

        this.distinctLocations = Array.from(locations);
        console.log('Distinct locations:', this.distinctLocations);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
  }


}
