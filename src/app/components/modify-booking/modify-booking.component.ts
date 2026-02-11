import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { ExpertService, Expert } from '../../services/expert.service';
import { ExpertSelectionModalComponent } from '../expert-selection-modal/expert-selection-modal.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { CancelConfirmationDialog } from '../booking-details/booking-details.component';
import * as BookingActions from '../../store/actions/booking.actions';
import { AppState } from '../../store/app.state';
import { Service, TimeSlot, Address } from '../../store/models/booking.model';

@Component({
  selector: 'app-modify-booking',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './modify-booking.component.html',
  styleUrl: './modify-booking.component.scss'
})
export class ModifyBookingComponent implements OnInit {
  booking: SavedBooking | null = null;
  isLoading = true;
  error: string | null = null;
  bookingId: string | null = null;
  
  // Modified values
  modifiedExpert: Expert | null = null;
  modifiedService: Service | null = null;
  modifiedDate: string | null = null;
  modifiedTimeSlot: TimeSlot | null = null;
  modifiedDuration: number | null = null;
  modifiedAddress: Address | null = null;
  
  // Pricing
  originalAmount = 0;
  newAmount = 0;
  amountPaid = 0;
  amountToPay = 0;
  refundAmount = 0;
  
  // Price breakdown
  newBaseAmount = 0;
  newGst = 0;
  newDiscount = 0;
  
  // Constants
  private readonly DEFAULT_PRICE_PER_HOUR = 100;
  private readonly PARTIAL_PAYMENT_RATIO = 0.5; // 50% for partial payments

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private expertService: ExpertService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    
    // Defensive validation: check if bookingId is valid
    if (!this.bookingId || (typeof this.bookingId === 'string' && this.bookingId.trim() === '')) {
      console.error('[ModifyBooking] No booking ID provided in route params');
      this.error = 'No booking ID provided. Please return to the bookings list.';
      this.isLoading = false;
      return;
    }
    
    console.log('[ModifyBooking] Booking ID from route:', this.bookingId);
    this.loadBookingDetails();
  }

  loadBookingDetails() {
    if (!this.bookingId) {
      console.error('[ModifyBooking] loadBookingDetails called without bookingId');
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('[ModifyBooking] Loading booking with ID:', this.bookingId);
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        console.log('[ModifyBooking] Successfully loaded booking:', booking);
        this.booking = booking;
        this.originalAmount = booking.totalAmount;
        
        // Determine paid amount based on payment status
        if (booking.paymentStatus === 'paid') {
          this.amountPaid = booking.totalAmount;
        } else if (booking.paymentStatus === 'partial') {
          // TODO: Store actual partial payment amount in booking object
          // For now, using a ratio-based calculation
          this.amountPaid = Math.floor(booking.totalAmount * this.PARTIAL_PAYMENT_RATIO);
        } else {
          this.amountPaid = 0;
        }
        
        // If booking status is completed or upcoming, assume it's paid
        if (booking.status === 'completed' || booking.status === 'upcoming') {
          this.amountPaid = booking.totalAmount;
        }
        
        // Load the original expert details
        if (booking.expertId) {
          this.expertService.getExpertById(booking.expertId).subscribe({
            next: (expert) => {
              this.modifiedExpert = expert;
              this.isLoading = false;
              this.calculateAmounts();
            },
            error: () => {
              this.isLoading = false;
              this.calculateAmounts();
            }
          });
        } else {
          this.isLoading = false;
          this.calculateAmounts();
        }
      },
      error: (error) => {
        console.error('[ModifyBooking] Error loading booking details:', error);
        this.error = 'Failed to load booking details. The booking may not exist.';
        this.isLoading = false;
      }
    });
  }

  editExpert() {
    if (!this.booking) return;
    
    const dialogRef = this.dialog.open(ExpertSelectionModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        serviceCategory: this.booking.serviceName,
        currentExpertId: this.booking.expertId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.expert) {
        this.modifiedExpert = result.expert;
        this.calculateAmounts();
        this.snackBar.open('Expert updated. Check the new pricing below.', 'OK', {
          duration: 3000
        });
      }
    });
  }

  editService() {
    // Open service selection in a dialog or navigate
    this.snackBar.open('Service modification coming soon', 'OK', { duration: 3000 });
    // TODO: Implement service selection modal
  }

  editSchedule() {
    // Open schedule editor in a dialog or navigate
    this.snackBar.open('Schedule modification coming soon', 'OK', { duration: 3000 });
    // TODO: Implement schedule editor modal
  }

  editAddress() {
    // Open address selection/editor in a dialog or navigate
    this.snackBar.open('Address modification coming soon', 'OK', { duration: 3000 });
    // TODO: Implement address selection modal
  }

  calculateAmounts() {
    if (!this.booking) return;
    
    // Calculate new pricing based on modifications
    const duration = this.modifiedDuration || this.booking.duration;
    let pricePerHour = this.DEFAULT_PRICE_PER_HOUR;
    
    // Get expert's price if available
    if (this.modifiedExpert?.pricePerHour) {
      pricePerHour = this.modifiedExpert.pricePerHour;
    } else if (this.booking.baseAmount && this.booking.duration) {
      // Derive original price per hour from booking
      pricePerHour = Math.floor(this.booking.baseAmount / this.booking.duration);
    }
    
    // Calculate new base amount
    this.newBaseAmount = pricePerHour * duration;
    
    // Calculate GST (18%)
    this.newGst = Math.floor(this.newBaseAmount * 0.18);
    
    // Carry over discount if applicable (could be updated based on new pricing logic)
    this.newDiscount = this.booking.discount || 0;
    
    // Calculate new total
    this.newAmount = this.newBaseAmount + this.newGst - this.newDiscount;
    
    // Calculate amount to pay or refund
    const priceDifference = this.newAmount - this.amountPaid;
    
    if (priceDifference > 0) {
      // Need to pay more
      this.amountToPay = priceDifference;
      this.refundAmount = 0;
    } else if (priceDifference < 0) {
      // Refund scenario
      this.amountToPay = 0;
      this.refundAmount = Math.abs(priceDifference);
    } else {
      // No change in price
      this.amountToPay = 0;
      this.refundAmount = 0;
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
        this.bookingService.updateBooking(this.booking.id, { 
          status: 'cancelled_by_customer',
          cancelledBy: 'customer',
          updatedAt: new Date().toISOString()
        }).subscribe({
          next: () => {
            this.snackBar.open('Booking cancelled successfully!', 'OK', { duration: 3000 });
            setTimeout(() => {
              this.router.navigate(['/my-bookings']);
            }, 1000);
          },
          error: (error) => {
            console.error('Error cancelling booking:', error);
            this.error = 'Failed to cancel booking';
          }
        });
      }
    });
  }

  confirmChanges() {
    if (!this.booking?.id) return;

    // Check if any modifications were made
    if (!this.modifiedExpert && !this.modifiedService && !this.modifiedDate && 
        !this.modifiedTimeSlot && !this.modifiedDuration && !this.modifiedAddress) {
      this.snackBar.open('No changes detected', 'OK', { duration: 3000 });
      return;
    }

    // If amount to pay > 0, open payment modal
    if (this.amountToPay > 0) {
      this.openPaymentModal();
    } else if (this.refundAmount > 0) {
      // Show refund message and save changes
      const message = `₹${this.refundAmount}/- will be refunded to your account. Confirm changes?`;
      this.snackBar.open(message, 'CONFIRM', {
        duration: 10000
      }).onAction().subscribe(() => {
        this.saveChanges();
      });
    } else {
      // No payment or refund, just save changes
      this.saveChanges();
    }
  }

  openPaymentModal() {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '680px',
      disableClose: true,
      data: {
        totalAmount: this.amountToPay,
        baseAmount: this.newBaseAmount,
        gst: this.newGst
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success && result?.transactionId) {
        this.saveChanges(result.transactionId);
      }
    });
  }

  saveChanges(transactionId?: string) {
    if (!this.booking?.id) return;

    const updates: Partial<SavedBooking> = {};
    
    // Track if expert changed for proper propagation
    const expertChanged = this.modifiedExpert && this.modifiedExpert.id !== this.booking.expertId;
    
    // Add modified fields to updates
    if (this.modifiedExpert) {
      // Store previous expert ID for audit trail
      if (expertChanged) {
        updates.previousExpertId = this.booking.expertId;
      }
      updates.expertName = this.modifiedExpert.fullName;
      updates.expertId = this.modifiedExpert.id;
      
      // If expert changed and booking was accepted, reset to pending
      if (expertChanged && this.booking.status === 'upcoming') {
        updates.status = 'pending';
        this.snackBar.open('Expert changed. New expert will need to accept the booking.', 'OK', {
          duration: 5000
        });
      }
    }
    
    // Update pricing
    if (this.newAmount !== this.originalAmount) {
      updates.baseAmount = this.newBaseAmount;
      updates.gst = this.newGst;
      updates.discount = this.newDiscount;
      updates.totalAmount = this.newAmount;
    }
    
    if (transactionId) {
      updates.transactionId = transactionId;
      updates.paymentStatus = 'paid';
    }
    
    // If refund scenario, mark payment status accordingly
    if (this.refundAmount > 0) {
      updates.paymentStatus = 'paid'; // Keep as paid since refund will be processed separately
      // TODO: Implement refund transaction tracking
      // This should create a refund record in a refunds table/collection
      // with booking ID, amount, status (pending/completed/failed), timestamp
      // The refund can be processed asynchronously by a payment service
    }
    
    // Add updated timestamp
    updates.updatedAt = new Date().toISOString();

    this.bookingService.updateBooking(this.booking.id, updates).subscribe({
      next: () => {
        this.snackBar.open('Booking updated successfully!', 'OK', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error updating booking:', error);
        this.error = 'Failed to update booking';
        this.snackBar.open('Failed to update booking. Please try again.', 'OK', { duration: 5000 });
      }
    });
  }

  goBack() {
    this.router.navigate(['/my-bookings']);
  }

  getCurrentExpertName(): string {
    return this.modifiedExpert?.fullName || this.booking?.expertName || 'No Expert Selected';
  }

  hasModifications(): boolean {
    return !!(this.modifiedExpert || this.modifiedService || this.modifiedDate || 
              this.modifiedTimeSlot || this.modifiedDuration || this.modifiedAddress);
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
