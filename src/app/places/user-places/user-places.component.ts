import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  userPlaces = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesServices = inject(PlacesService);
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesServices.loadUserPlaces().subscribe({
      next: (places) => {
          console.log(places);
          this.userPlaces.set(places);
      },
      error: (error: Error) => {
        console.log(error);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
