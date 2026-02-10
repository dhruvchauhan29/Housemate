import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService, User } from '../../services/auth.service';
import { BookingService, Booking } from '../../services/booking.service';

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatCardModule, MatExpansionModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  upcomingBookings: Booking[] = [];
  currentBookingIndex = 0;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUpcomingBookings();
  }

  loadUpcomingBookings() {
    const userId = this.currentUser?.id;
    if (userId) {
      this.bookingService.getUpcomingBookings(userId).subscribe({
        next: (bookings) => {
          this.upcomingBookings = bookings;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          // Keep empty array on error
          this.upcomingBookings = [];
        }
      });
    }
  }

  get hasMultipleBookings(): boolean {
    return this.upcomingBookings.length > 1;
  }

  get canNavigatePrevious(): boolean {
    return this.currentBookingIndex > 0;
  }

  get canNavigateNext(): boolean {
    return this.currentBookingIndex < this.upcomingBookings.length - 1;
  }

  previousBooking(): void {
    if (this.canNavigatePrevious) {
      this.currentBookingIndex--;
    }
  }

  nextBooking(): void {
    if (this.canNavigateNext) {
      this.currentBookingIndex++;
    }
  }

  goToBooking(index: number): void {
    if (index >= 0 && index < this.upcomingBookings.length) {
      this.currentBookingIndex = index;
    }
  }

  get visibleBookings(): Booking[] {
    if (this.upcomingBookings.length === 0) {
      return [];
    }
    return [this.upcomingBookings[this.currentBookingIndex]];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToBookService() {
    this.router.navigate(['/book-service']);
  }

  navigateToBookings() {
    // Navigate to bookings page - to be implemented
    console.log('Navigate to My Bookings');
  }

  viewBookingDetails(bookingId: number) {
    // To be implemented
    console.log('View booking details:', bookingId);
  }

  modifyBooking(bookingId: number) {
    // To be implemented
    console.log('Modify booking:', bookingId);
  }
}

