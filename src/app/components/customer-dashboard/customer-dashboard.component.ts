import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService, User } from '../../services/auth.service';

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
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  upcomingBookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUpcomingBookings();
  }

  loadUpcomingBookings() {
    // Mock data for upcoming bookings - will be replaced with API call later
    this.upcomingBookings = [
      {
        id: 1,
        serviceIcon: '🧹', // Image placeholder: Cleaning service icon from Figma
        serviceName: 'Cleaning',
        price: '₹299/-',
        date: '31 Jan, Wednesday',
        time: '2:30 PM',
        duration: '2hrs',
        location: '201, Manjari Khurd, Pune - 143505'
      },
      {
        id: 2,
        serviceIcon: '👨‍🍳', // Image placeholder: Cooking service icon from Figma
        serviceName: 'Cooking',
        price: '₹450/-',
        date: '2 Feb, Friday',
        time: '11:00 AM',
        duration: '3hrs',
        location: '45, Koregaon Park, Pune - 411001'
      },
      {
        id: 3,
        serviceIcon: '🌱', // Image placeholder: Gardening service icon from Figma
        serviceName: 'Gardening',
        price: '₹350/-',
        date: '5 Feb, Monday',
        time: '8:00 AM',
        duration: '2hrs',
        location: '78, Baner Road, Pune - 411045'
      }
    ];
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

