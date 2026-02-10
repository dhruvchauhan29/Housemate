import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { selectExpert } from '../../store/actions/booking.actions';
import { Expert } from '../../store/models/booking.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-book-service',
  imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.scss'
})
export class BookServiceComponent implements OnInit {
  currentUser: User | null = null;
  currentRoute: string = '';
  selectedServiceId: string | undefined;
  selectedExpertId: string | undefined;
  preselectedExpertId: string | undefined;

  // Mock experts data - should match the data in select-expert component
  mockExperts: Expert[] = [
    {
      id: '1',
      name: 'John Smith',
      rating: 4.8,
      reviewCount: 127,
      experience: '5 years',
      distance: '2.5 km',
      pricePerHour: 300,
      verified: true,
      services: ['House Cleaning', 'Deep Cleaning', 'Kitchen Cleaning'],
      languages: ['English', 'Hindi']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 203,
      experience: '7 years',
      distance: '3.2 km',
      pricePerHour: 350,
      verified: true,
      services: ['House Cleaning', 'Laundry', 'Ironing'],
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: '3',
      name: 'Michael Brown',
      rating: 4.7,
      reviewCount: 89,
      experience: '4 years',
      distance: '4.1 km',
      pricePerHour: 280,
      verified: true,
      services: ['Plumbing', 'Electrical', 'AC Repair'],
      languages: ['English', 'Hindi']
    },
    {
      id: '4',
      name: 'Emily Davis',
      rating: 4.6,
      reviewCount: 156,
      experience: '6 years',
      distance: '1.8 km',
      pricePerHour: 320,
      verified: false,
      services: ['House Cleaning', 'Window Cleaning', 'Carpet Cleaning'],
      languages: ['English', 'Hindi', 'Bengali']
    },
    {
      id: '5',
      name: 'David Wilson',
      rating: 4.9,
      reviewCount: 178,
      experience: '8 years',
      distance: '2.9 km',
      pricePerHour: 400,
      verified: true,
      services: ['Painting', 'Carpentry', 'Home Renovation'],
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      rating: 4.8,
      reviewCount: 134,
      experience: '5 years',
      distance: '3.5 km',
      pricePerHour: 310,
      verified: true,
      services: ['House Cleaning', 'Organizing', 'Decluttering'],
      languages: ['English', 'Hindi']
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    // Check for expertId query parameter
    this.route.queryParams.subscribe(params => {
      const expertId = params['expertId'];
      if (expertId && !this.selectedExpertId) {
        this.preselectedExpertId = expertId;
        // Find the expert from mock data and dispatch to store
        const expert = this.mockExperts.find(e => e.id === expertId);
        if (expert) {
          this.store.dispatch(selectExpert({ expert }));
        }
      }
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
      // If expert is already selected, skip expert selection and go to date/time
      if (this.selectedExpertId && this.selectedServiceId) {
        this.router.navigate(['/book-service/select-datetime']);
      } else if (this.selectedServiceId) {
        // Navigate to expert selection if only service is selected
        this.router.navigate(['/book-service/select-expert']);
      }
    } else if (this.currentRoute.includes('select-expert')) {
      // Navigate to date/time selection if expert is selected
      if (this.selectedExpertId) {
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
      return !this.selectedServiceId;
    } else if (this.currentRoute.includes('select-expert')) {
      return !this.selectedExpertId;
    }
    return false;
  }
}

