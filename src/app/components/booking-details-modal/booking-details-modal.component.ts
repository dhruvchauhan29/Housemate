import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { CancelConfirmationDialog } from '../booking-details/booking-details.component';

@Component({
  selector: 'app-booking-details-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent implements OnInit {
  booking: SavedBooking | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<BookingDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: number | string },
    private bookingService: BookingService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    // Defensive validation: check if bookingId is valid
    if (!this.data.bookingId) {
      console.error('[BookingDetailsModal] No booking ID provided');
      this.error = 'No booking ID provided. Please close and try again.';
      this.isLoading = false;
      return;
    }
    
    console.log('[BookingDetailsModal] Booking ID from data:', this.data.bookingId);
    this.loadBookingDetails();
  }

  loadBookingDetails() {
    if (!this.data.bookingId) {
      console.error('[BookingDetailsModal] loadBookingDetails called without bookingId');
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('[BookingDetailsModal] Loading booking with ID:', this.data.bookingId);
    this.bookingService.getBookingById(this.data.bookingId).subscribe({
      next: (booking) => {
        console.log('[BookingDetailsModal] Successfully loaded booking:', booking);
        this.booking = booking;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[BookingDetailsModal] Error loading booking details:', error);
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
    // Check if payment status is unpaid or partial
    return this.booking.paymentStatus === 'unpaid' || this.booking.paymentStatus === 'partial';
  }

  modifyBooking() {
    if (this.booking?.id) {
      this.dialogRef.close();
      this.router.navigate(['/modify-booking', this.booking.id]);
    }
  }

  cancelBooking() {
    if (!this.booking?.id) return;

    const cancelDialogRef = this.dialog.open(CancelConfirmationDialog, {
      width: '400px',
      data: { booking: this.booking }
    });

    cancelDialogRef.afterClosed().subscribe(result => {
      if (result === true && this.booking?.id) {
        this.bookingService.updateBooking(this.booking.id, { status: 'cancelled' }).subscribe({
          next: () => {
            this.dialogRef.close({ cancelled: true });
          },
          error: (error) => {
            console.error('Error cancelling booking:', error);
            this.error = 'Failed to cancel booking. Please try again.';
          }
        });
      }
    });
  }

  payNow() {
    if (!this.booking) return;

    const paymentDialogRef = this.dialog.open(PaymentModalComponent, {
      width: '680px',
      disableClose: true,
      data: {
        totalAmount: this.booking.totalAmount,
        baseAmount: this.booking.baseAmount,
        gst: this.booking.gst
      }
    });

    paymentDialogRef.afterClosed().subscribe(result => {
      if (result?.transactionId && this.booking?.id) {
        // Update booking with payment info
        this.bookingService.updateBooking(this.booking.id, {
          transactionId: result.transactionId,
          paymentStatus: 'paid'
        }).subscribe({
          next: () => {
            this.dialogRef.close({ paid: true });
          },
          error: (error) => {
            console.error('Error updating payment status:', error);
          }
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
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

  getPaymentStatusLabel(): string {
    if (!this.booking) return '';
    
    if (this.booking.paymentStatus === 'paid') return 'Paid';
    if (this.booking.paymentStatus === 'unpaid') return 'To Pay';
    if (this.booking.paymentStatus === 'partial') return 'Partially Paid';
    
    // Fallback based on booking status
    if (this.booking.status === 'completed' || this.booking.status === 'upcoming') return 'Paid';
    return 'To Pay';
  }
}
