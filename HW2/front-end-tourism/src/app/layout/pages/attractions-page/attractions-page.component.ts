import { Component, OnInit } from '@angular/core';
import { AttractionsService } from '../../../services/attraction-service/attractions.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-attractions-page',
  templateUrl: './attractions-page.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./attractions-page.component.css']
})

export class AttractionsPageComponent implements OnInit {
  attractions: any[] = [];
  loading: boolean = true;  // Loading state
  timeoutReached: boolean = false;  // Timeout flag

  constructor(private attractionsService: AttractionsService) {}

  ngOnInit(): void {
    this.fetchAttractions();
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

}

