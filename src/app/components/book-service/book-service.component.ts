import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-book-service',
  imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.scss'
})
export class BookServiceComponent {
  currentUser: User | null = null;
  currentRoute: string = '';
  selectedServiceId: string | undefined;
  selectedExpertId: string | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to router events to track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
    
    // Subscribe to store to get selected service and expert
    this.store.select(selectSelectedService).subscribe(service => {
      this.selectedServiceId = service?.id;
    });
    
    this.store.select(selectSelectedExpert).subscribe(expert => {
      this.selectedExpertId = expert?.id;
    });
  }

  navigateHome() {
    this.router.navigate(['/customer/dashboard']);
  }

  navigateToServices() {
    this.router.navigate(['/book-service']);
  }
  
  navigateNext() {
    if (this.currentRoute.includes('select-service')) {
      // Navigate to date/time selection if both service and expert are selected
      if (this.selectedServiceId && this.selectedExpertId) {
        this.router.navigate(['/book-service/select-datetime']);
      }
    } else if (this.currentRoute.includes('select-datetime')) {
      this.router.navigate(['/book-service/select-address']);
    } else if (this.currentRoute.includes('select-address')) {
      this.router.navigate(['/book-service/booking-summary']);
    }
  }
  
  isNextButtonDisabled(): boolean {
    if (this.currentRoute.includes('select-service')) {
      return !this.selectedServiceId || !this.selectedExpertId;
    }
    return false;
  }
}

