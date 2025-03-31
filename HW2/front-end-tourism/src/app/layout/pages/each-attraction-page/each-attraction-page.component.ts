import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttractionsService } from '../../../services/attraction-service/attractions.service';
import { CommonModule } from '@angular/common';
import { LocationImageServiceService } from '../../../services/location-image-service/location-image-service.service';
import { UserDataService, Review } from '../../../services/user-data/user-data.service';  // Import the UserDataService

@Component({
  selector: 'app-each-attraction-page',
  imports: [CommonModule],
  templateUrl: './each-attraction-page.component.html',
  styleUrls: ['./each-attraction-page.component.css'],
  standalone: true
})
export class EachAttractionPageComponent implements OnInit {
  attraction: any = null;
  loading: boolean = true;
  error: boolean = false;
  timeoutReached: boolean = false;
  attractionImage: string = '';
  map: any = null;
  reviews: Review[] = [];  // Store reviews for the attraction, now typed as Review[]
  reviewsLoading: boolean = false;  // Handle loading state for reviews
  reviewsError: boolean = false;  // Handle error state for reviews

  @ViewChild('map', { static: false }) mapContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attractionsService: AttractionsService,
    private locationImageService: LocationImageServiceService,
    private userDataService: UserDataService,  // Inject the UserDataService
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const attractionId = this.route.snapshot.paramMap.get('id');
    if (attractionId) {
      this.fetchAttractionDetails(attractionId);
      this.fetchReviews(attractionId);  // Fetch reviews for the attraction
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  fetchAttractionDetails(id: string): void {
    setTimeout(() => {
      if (this.loading) {
        this.timeoutReached = true;
        this.loading = false;
      }
    }, 10000);

    this.attractionsService.getAttractions()
      .then(attractions => {
        const attraction = attractions.find(a => a.id === id);
        if (attraction) {
          this.attraction = attraction;
          if (isPlatformBrowser(this.platformId)) {
            this.initializeMap(attraction.location);
          }
        } else {
          this.error = true;
        }
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  }

  fetchReviews(attractionId: string): void {
    this.reviewsLoading = true;

    // Now the response is explicitly typed as Review[]
    this.userDataService.getReviewsByAttractionId(attractionId).subscribe(
      (reviews: Review[]) => {  // Ensure reviews are typed as Review[]
        this.reviews = reviews;
        this.reviewsLoading = false;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        this.reviewsError = true;
        this.reviewsLoading = false;
      }
    );
  }

  initializeMap(location: string): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent( this.attraction.name)}`;

        fetch(geocodeUrl)
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);

              this.map = L.map(this.mapContainer.nativeElement).setView([lat, lon], 13);

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
              }).addTo(this.map);

              L.marker([lat, lon]).addTo(this.map)
                .bindPopup(`<b>${this.attraction.name}</b><br>${this.attraction.location}`)
                .openPopup();
            } else {
              console.error('Location not found');
            }
          })
          .catch(error => {
            console.error('Error fetching location data:', error);
          });
      }).catch(err => {
        console.error('Error loading Leaflet:', err);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/attractions']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
