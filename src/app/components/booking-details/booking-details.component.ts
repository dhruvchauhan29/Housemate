import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent implements OnInit {
  booking: SavedBooking | null = null;
  isLoading = true;
  error: string | null = null;
  bookingId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    
    // Defensive validation: check if bookingId is valid
    if (!this.bookingId || this.bookingId.trim() === '') {
      console.error('[BookingDetails] No booking ID provided in route params');
      this.error = 'No booking ID provided. Please return to the bookings list.';
      this.isLoading = false;
      return;
    }
    
    // Validate that the ID can be converted to a number (if using numeric IDs)
    const numericId = Number(this.bookingId);
    if (isNaN(numericId)) {
      console.error('[BookingDetails] Invalid booking ID:', this.bookingId);
      this.error = 'Invalid booking ID. Please return to the bookings list.';
      this.isLoading = false;
      return;
    }
    
    this.loadBookingDetails();
  }

  loadBookingDetails() {
    if (!this.bookingId) {
      console.error('[BookingDetails] loadBookingDetails called without bookingId');
      return;
    }

    const numericId = Number(this.bookingId);
    if (isNaN(numericId)) {
      console.error('[BookingDetails] Cannot load booking with invalid ID:', this.bookingId);
      this.error = 'Invalid booking ID. Please return to the bookings list.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('[BookingDetails] Loading booking with ID:', numericId);
    this.bookingService.getBookingById(numericId).subscribe({
      next: (booking) => {
        console.log('[BookingDetails] Successfully loaded booking:', booking);
        this.booking = booking;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[BookingDetails] Error loading booking details:', error);
        this.error = 'Failed to load booking details. The booking may not exist.';
        this.isLoading = false;
      }
    });
  }

  canModify(): boolean {
    return this.booking?.status === 'upcoming' || this.booking?.status === 'pending';
  }

  canCancel(): boolean {
    return this.booking?.status === 'upcoming' || this.booking?.status === 'pending';
  }

  hasDuePayment(): boolean {
    if (!this.booking) return false;
    // Check if there's a due payment (this could be extended with actual payment tracking)
    return this.booking.status === 'pending';
  }

  modifyBooking() {
    if (this.booking?.id) {
      this.router.navigate(['/modify-booking', this.booking.id]);
    }
  }

  cancelBooking() {
    if (!this.booking?.id) return;

    const dialogRef = this.dialog.open(CancelConfirmationDialog, {
      width: '400px',
      data: { booking: this.booking }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && this.booking?.id) {
        this.bookingService.updateBooking(+this.booking.id, { status: 'cancelled' }).subscribe({
          next: () => {
            this.router.navigate(['/my-bookings']);
          },
          error: (error) => {
            console.error('Error cancelling booking:', error);
            this.error = 'Failed to cancel booking';
          }
        });
      }
    });
  }

  payNow() {
    // Navigate to payment with booking ID
    // This would typically open payment modal or navigate to payment page
    console.log('Pay now for booking:', this.booking?.id);
    // TODO: Implement payment flow
  }

  goBack() {
    this.router.navigate(['/my-bookings']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'upcoming': return 'primary';
      case 'completed': return 'accent';
      case 'cancelled': return 'warn';
      case 'rejected': return 'warn';
      case 'pending': return '';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

// Cancel Confirmation Dialog Component
@Component({
  selector: 'cancel-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Cancel Booking</h2>
    <mat-dialog-content>
      <p>Are you sure you want to cancel this booking?</p>
      <div class="booking-summary">
        <p><strong>Service:</strong> {{ data.booking.serviceName }}</p>
        <p><strong>Date:</strong> {{ data.booking.date | date: 'fullDate' }}</p>
        <p><strong>Time:</strong> {{ data.booking.timeSlot }}</p>
      </div>
      <p class="warning-text">
        <mat-icon>warning</mat-icon>
        This action cannot be undone. Cancellation policies may apply.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">No, Keep It</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Yes, Cancel Booking</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .booking-summary {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .warning-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      margin-top: 16px;
    }
    mat-icon {
      vertical-align: middle;
    }
  `],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule]
})
export class CancelConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { booking: SavedBooking }) {}
}
