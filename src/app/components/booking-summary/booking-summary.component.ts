import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-summary',
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss'
})
export class BookingSummaryComponent {
  constructor(private router: Router) {}

  confirmBooking() {
    // Payment logic will be implemented here
    console.log('Booking confirmed');
  }

  previousStep() {
    this.router.navigate(['/book-service/select-address']);
  }
}
