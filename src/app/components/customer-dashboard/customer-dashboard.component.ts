import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService, User } from '../../services/auth.service';
import { BookingService, SavedBooking } from '../../services/booking.service';

interface Booking {
  id: number;
  serviceIcon: string;
  serviceName: string;
  price: string;
  date: string;
  time: string;
  duration: string;
  location: string;
}

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatCardModule, MatExpansionModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingsContainer', { read: ElementRef }) bookingsContainer?: ElementRef;
  
  currentUser: User | null = null;
  upcomingBookings: Booking[] = [];
  showLeftArrow = false;
  showRightArrow = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUpcomingBookings();
  }

  ngAfterViewInit() {
    // Check if arrows are needed after view initializes
    setTimeout(() => this.checkArrowsVisibility(), 100);
  }

  loadUpcomingBookings() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      console.error('No user logged in');
      return;
    }

    this.bookingService.getBookingsByCustomerId(currentUser.id).subscribe({
      next: (bookings: SavedBooking[]) => {
        this.upcomingBookings = bookings.map(booking => ({
          id: booking.id!,
          serviceIcon: booking.serviceIcon,
          serviceName: booking.serviceName,
          price: `₹${booking.totalAmount}/-`,
          date: this.formatDate(booking.date),
          time: this.formatTimeSlot(booking.timeSlot),
          duration: `${booking.duration}hrs`,
          location: booking.address
        }));
        
        // Check arrows visibility after bookings are loaded
        setTimeout(() => this.checkArrowsVisibility(), 100);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        // Fallback to empty array if error
        this.upcomingBookings = [];
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  }

  formatTimeSlot(timeSlot: string): string {
    // timeSlot format: "10:00 AM - 12:00 PM"
    const parts = timeSlot.split(' - ');
    return parts[0]; // Return start time
  }

  checkArrowsVisibility() {
    if (!this.bookingsContainer) return;
    
    const container = this.bookingsContainer.nativeElement;
    const hasOverflow = container.scrollWidth > container.clientWidth;
    
    this.showLeftArrow = hasOverflow && container.scrollLeft > 0;
    this.showRightArrow = hasOverflow && container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
  }

  scrollLeft() {
    if (!this.bookingsContainer) return;
    const container = this.bookingsContainer.nativeElement;
    container.scrollBy({ left: -350, behavior: 'smooth' });
    setTimeout(() => this.checkArrowsVisibility(), 300);
  }

  scrollRight() {
    if (!this.bookingsContainer) return;
    const container = this.bookingsContainer.nativeElement;
    container.scrollBy({ left: 350, behavior: 'smooth' });
    setTimeout(() => this.checkArrowsVisibility(), 300);
  }

  onScroll() {
    this.checkArrowsVisibility();
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

