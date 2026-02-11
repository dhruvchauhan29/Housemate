import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../../services/auth.service';
import { BookingService, SavedBooking } from '../../services/booking.service';

interface BookingCount {
  upcoming: number;
  completed: number;
  cancelled: number;
  rejected: number;
  all: number;
}

@Component({
  selector: 'app-my-bookings',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  currentUser: User | null = null;
  allBookings: SavedBooking[] = [];
  filteredBookings: SavedBooking[] = [];
  selectedTabIndex = 0;
  isLoading = false;
  error: string | null = null;
  
  bookingCounts: BookingCount = {
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
    all: 0
  };

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/customer/login']);
      return;
    }
    this.loadBookings();
  }

  loadBookings() {
    if (!this.currentUser?.id) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.bookingService.getBookingsByCustomerId(this.currentUser.id).subscribe({
      next: (bookings: SavedBooking[]) => {
        this.allBookings = bookings;
        this.calculateCounts();
        this.filterBookings('all');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  calculateCounts() {
    this.bookingCounts = {
      all: this.allBookings.length,
      upcoming: this.allBookings.filter(b => b.status === 'upcoming').length,
      completed: this.allBookings.filter(b => b.status === 'completed').length,
      cancelled: this.allBookings.filter(b => b.status === 'cancelled').length,
      rejected: this.allBookings.filter(b => b.status === 'rejected').length
    };
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    const statusMap = ['all', 'upcoming', 'completed', 'cancelled', 'rejected'];
    this.filterBookings(statusMap[index]);
  }

  filterBookings(status: string) {
    if (status === 'all') {
      this.filteredBookings = [...this.allBookings];
    } else {
      this.filteredBookings = this.allBookings.filter(b => b.status === status);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day} ${month}, ${weekday}`;
  }

  formatTimeSlot(timeSlot: string): string {
    const parts = timeSlot.split(' - ');
    return parts[0];
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  viewDetails(bookingId: string | number | undefined) {
    if (!bookingId) return;
    console.log('View details:', bookingId);
    // TODO: Navigate to booking details page
  }

  modifyBooking(bookingId: string | number | undefined) {
    if (!bookingId) return;
    console.log('Modify booking:', bookingId);
    // TODO: Navigate to booking modification page
  }

  callExpert(phone: string) {
    console.log('Call expert:', phone);
    // TODO: Implement call functionality
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToDashboard() {
    this.router.navigate(['/customer/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
