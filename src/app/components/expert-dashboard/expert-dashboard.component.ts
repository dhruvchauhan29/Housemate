import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { AuthService, User } from '../../services/auth.service';
import { AppState } from '../../store/app.state';
import { ExpertStats, Job } from '../../store/models/booking.model';
import { selectExpertStats, selectExpertJobs, selectPendingJobs } from '../../store/selectors/expert.selectors';

@Component({
  selector: 'app-expert-dashboard',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatCardModule],
  templateUrl: './expert-dashboard.component.html',
  styleUrl: './expert-dashboard.component.scss'
})
export class ExpertDashboardComponent implements OnInit {
  currentUser: User | null = null;
  expertStats$: Observable<ExpertStats | null>;
  jobs$: Observable<Job[]>;
  pendingJobs$: Observable<Job[]>;
  
  // Mock data for demonstration
  mockStats: ExpertStats = {
    totalJobs: 2,
    upcomingJobs: 5,
    completedJobs: 0,
    totalEarnings: 5700,
    averageRating: 4.7
  };

  mockJobs: Job[] = [
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
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

  viewJobDetails(job: Job) {
    console.log('View job details:', job);
    // Navigate to job details - to be implemented
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Accepted': 'status-accepted',
      'Rejected': 'status-rejected',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  }
}

