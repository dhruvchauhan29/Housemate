import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { selectExpert } from '../../store/actions/booking.actions';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MOCK_EXPERTS } from '../../shared/mock-data/experts.data';

@Component({
  selector: 'app-book-service',
  imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.scss'
})
export class BookServiceComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentRoute: string = '';
  selectedServiceId: string | undefined;
  selectedExpertId: string | undefined;
  preselectedExpertId: string | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to router events to track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
    
    // Subscribe to store to get selected service and expert
    this.store.select(selectSelectedService)
      .pipe(takeUntil(this.destroy$))
      .subscribe(service => {
        this.selectedServiceId = service?.id;
      });
    
    this.store.select(selectSelectedExpert)
      .pipe(takeUntil(this.destroy$))
      .subscribe(expert => {
        this.selectedExpertId = expert?.id;
      });
  }

  ngOnInit(): void {
    // Check for expertId query parameter
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const expertId = params['expertId'];
        if (expertId && !this.selectedExpertId) {
          this.preselectedExpertId = expertId;
          // Find the expert from mock data and dispatch to store
          const expert = MOCK_EXPERTS.find(e => e.id === expertId);
          if (expert) {
            this.store.dispatch(selectExpert({ expert }));
            // Navigate to select-service when expert is preselected via query param
            // The select-service page will display the expert details and allow service selection
            this.router.navigate(['/book-service/select-service'], { replaceUrl: true });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

