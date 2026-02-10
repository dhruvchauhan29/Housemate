import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { AppState } from '../../store/app.state';
import { ExpertStats, Job } from '../../store/models/booking.model';
import { selectExpertStats, selectExpertJobs, selectPendingJobs } from '../../store/selectors/expert.selectors';

@Component({
  selector: 'app-expert-dashboard',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatCardModule, 
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './expert-dashboard.component.html',
  styleUrl: './expert-dashboard.component.scss'
})
export class ExpertDashboardComponent implements OnInit {
  currentUser: User | null = null;
  expertStats$: Observable<ExpertStats | null>;
  jobs$: Observable<Job[]>;
  pendingJobs$: Observable<Job[]>;
  selectedStatus: string = 'all';
  
  // Mock data for demonstration
  mockStats: ExpertStats = {
    totalJobs: 2,
    upcomingJobs: 5,
    completedJobs: 0,
    totalEarnings: 5700,
    averageRating: 4.7
  };

  pendingJobs: Job[] = [
    {
      id: '1',
      serviceType: 'Cooking',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Pending',
      earnings: 299,
      duration: 2
    },
    {
      id: '2',
      serviceType: 'Gardening',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Pending',
      earnings: 299,
      duration: 2
    }
  ];

  allJobs: Job[] = [
    {
      id: '1',
      serviceType: 'Gardening',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Pending',
      earnings: 299,
      duration: 2
    },
    {
      id: '2',
      serviceType: 'Gardening',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Accepted',
      earnings: 299,
      duration: 2
    },
    {
      id: '3',
      serviceType: 'Cooking',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Rejected',
      earnings: 299,
      duration: 2
    },
    {
      id: '4',
      serviceType: 'Cooking',
      customerName: 'John Doe',
      date: '31 Jan, Wednesday',
      timeSlot: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505',
      status: 'Cancelled',
      earnings: 299,
      duration: 2
    }
  ];

  calendarDays: number[] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.expertStats$ = this.store.select(selectExpertStats);
    this.jobs$ = this.store.select(selectExpertJobs);
    this.pendingJobs$ = this.store.select(selectPendingJobs);
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  takeAction(job: Job) {
    console.log('Take action for job:', job);
    // TODO: Open take action modal/dialog
  }

  viewDetails(job: Job) {
    console.log('View details for job:', job);
    // TODO: Navigate to job details or open dialog
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'Pending': 'schedule',
      'Accepted': 'check_circle',
      'Rejected': 'cancel',
      'Completed': 'check_circle',
      'Cancelled': 'cancel'
    };
    return iconMap[status] || 'info';
  }

  getServiceIcon(serviceType: string): string {
    const iconMap: { [key: string]: string } = {
      'Cooking': 'restaurant',
      'Gardening': 'yard',
      'Cleaning': 'cleaning_services',
      'Electrician': 'electrical_services',
      'Plumbing': 'plumbing'
    };
    return iconMap[serviceType] || 'home_repair_service';
  }

  previousDay(): void {
    // TODO: Implement previous day navigation
    console.log('Navigate to previous day');
  }

  nextDay(): void {
    // TODO: Implement next day navigation
    console.log('Navigate to next day');
  }

  selectDay(day: number): void {
    // TODO: Implement day selection
    console.log('Selected day:', day);
  }

  hasEventOnDay(day: number): boolean {
    // TODO: Replace with actual event checking logic based on appointment data
    // For now, showing events on days 22, 25, 28 as demonstration
    return day === 22 || day === 25 || day === 28;
  }
}

