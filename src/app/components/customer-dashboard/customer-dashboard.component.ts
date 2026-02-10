import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from '../../services/auth.service';

interface Booking {
  id: string;
  price: number;
  date: string;
  time: string;
  address: string;
}

interface PopularService {
  id: string;
  name: string;
}

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  upcomingBookings: Booking[] = [
    {
      id: '1',
      price: 299,
      date: '31 Jan, Wednesday',
      time: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505'
    },
    {
      id: '2',
      price: 299,
      date: '31 Jan, Wednesday',
      time: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505'
    },
    {
      id: '3',
      price: 299,
      date: '31 Jan, Wednesday',
      time: '2:30 PM, booked for 2hrs',
      address: '201, Manjari Khurd, Pune - 143505'
    }
  ];

  popularServices: PopularService[] = [
    { id: '1', name: 'Cleaning' },
    { id: '2', name: 'Cooking' },
    { id: '3', name: 'Gardening' },
    { id: '4', name: 'Cleaning' },
    { id: '5', name: 'Cooking' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

  navigateToBookService() {
    this.router.navigate(['/book-service']);
  }

  navigateToBookings() {
    // Navigate to bookings page - to be implemented
    console.log('Navigate to My Bookings');
  }
}

