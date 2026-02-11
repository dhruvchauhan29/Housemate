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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { AppState } from '../../store/app.state';
import { ExpertStats, Job } from '../../store/models/booking.model';
import { selectExpertStats, selectExpertJobs, selectPendingJobs } from '../../store/selectors/expert.selectors';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { TakeActionModalComponent } from '../take-action-modal/take-action-modal.component';

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
    MatProgressSpinnerModule,
    MatSnackBarModule,
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

  // Real booking data
  bookings: SavedBooking[] = [];
  filteredBookings: SavedBooking[] = [];
  pendingBookings: SavedBooking[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Calculated stats from real data
  calculatedStats = {
    todayJobs: 0,
    weekJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  };
  
  // Calendar state
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  currentDay: number = new Date().getDate();
  selectedDate: Date = new Date();
  todayAppointments: SavedBooking[] = [];

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
    private dialog: MatDialog,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.expertStats$ = this.store.select(selectExpertStats);
    this.jobs$ = this.store.select(selectExpertJobs);
    this.pendingJobs$ = this.store.select(selectPendingJobs);
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBookings();
  }

  loadBookings() {
    if (!this.currentUser?.id) {
      this.error = 'User not found';
      return;
    }

    this.loading = true;
    this.error = '';

    this.bookingService.getBookingsByExpertId(this.currentUser.id).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filterBookings();
        this.pendingBookings = bookings.filter(b => b.status === 'pending');
        this.calculateStats();
        this.updateCalendar();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.error = 'Failed to load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    
    // Calculate today's jobs
    this.calculatedStats.todayJobs = this.bookings.filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime() && 
             (b.status === 'upcoming' || b.status === 'pending');
    }).length;
    
    // Calculate this week's jobs
    this.calculatedStats.weekJobs = this.bookings.filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today && bookingDate < weekEnd &&
             (b.status === 'upcoming' || b.status === 'pending');
    }).length;
    
    // Calculate total earnings from completed bookings
    this.calculatedStats.totalEarnings = this.bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    // Calculate average rating from completed bookings with feedback
    const ratedBookings = this.bookings.filter(b => b.feedback?.rating);
    if (ratedBookings.length > 0) {
      const totalRating = ratedBookings.reduce((sum, b) => sum + (b.feedback?.rating || 0), 0);
      this.calculatedStats.averageRating = Math.round((totalRating / ratedBookings.length) * 10) / 10;
    } else {
      // Use expert profile rating as fallback if available
      this.calculatedStats.averageRating = (this.currentUser as any)?.rating || 0;
    }
  }

  updateCalendar() {
    // Update today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.todayAppointments = this.bookings.filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime() &&
             (b.status === 'upcoming' || b.status === 'pending');
    });
    
    // Update calendar days based on current month/year
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  filterBookings() {
    if (this.selectedStatus === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(
        b => b.status === this.selectedStatus
      );
    }
  }

  onStatusFilterChange() {
    this.filterBookings();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  takeAction(booking: SavedBooking) {
    const dialogRef = this.dialog.open(TakeActionModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { booking },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'accepted') {
          this.snackBar.open('Booking accepted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else if (result.action === 'rejected') {
          this.snackBar.open('Booking rejected', 'Close', {
            duration: 3000,
            panelClass: ['info-snackbar']
          });
        }
        this.loadBookings();
      }
    });
  }

  takeActionOld(job: Job) {
    console.log('Take action for job:', job);
    // TODO: Open take action modal/dialog
  }

  viewDetails(booking: SavedBooking) {
    const dialogRef = this.dialog.open(TakeActionModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { booking },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBookings();
      }
    });
  }

  viewDetailsOld(job: Job) {
    console.log('View details for job:', job);
    // TODO: Navigate to job details or open dialog
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'upcoming': 'check_circle',
      'rejected': 'cancel',
      'completed': 'check_circle',
      'cancelled': 'cancel',
      'cancelled_by_customer': 'person_off',
      'Pending': 'schedule',
      'Accepted': 'check_circle',
      'Rejected': 'cancel',
      'Completed': 'check_circle',
      'Cancelled': 'cancel',
      'Cancelled by Customer': 'person_off'
    };
    return iconMap[status] || 'info';
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/_/g, '-');
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'pending': 'Pending',
      'upcoming': 'Booking Accepted',
      'rejected': 'Booking Rejected',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'cancelled_by_customer': 'Cancelled by Customer'
    };
    return labelMap[status] || status;
  }

  canTakeAction(booking: SavedBooking): boolean {
    return booking.status === 'pending';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      weekday: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  retryLoad() {
    this.loadBookings();
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
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    this.selectedDate = newDate;
    this.currentDay = this.selectedDate.getDate();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.updateTodayAppointments();
  }

  nextDay(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    this.selectedDate = newDate;
    this.currentDay = this.selectedDate.getDate();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.updateTodayAppointments();
  }

  selectDay(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.currentDay = day;
    this.updateTodayAppointments();
  }

  updateTodayAppointments(): void {
    const selectedDay = new Date(this.selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    
    this.todayAppointments = this.bookings.filter(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === selectedDay.getTime() &&
             (b.status === 'upcoming' || b.status === 'pending');
    });
  }

  hasEventOnDay(day: number): boolean {
    const checkDate = new Date(this.currentYear, this.currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    
    return this.bookings.some(b => {
      const bookingDate = new Date(b.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === checkDate.getTime() &&
             (b.status === 'upcoming' || b.status === 'pending');
    });
  }

  getMonthName(): string {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthNames[this.currentMonth];
  }

  getDayName(): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[this.selectedDate.getDay()];
  }
}

