import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { SelectServiceComponent } from '../select-service/select-service.component';
import { SelectDatetimeComponent } from '../select-datetime/select-datetime.component';
import { SelectAddressComponent } from '../select-address/select-address.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import * as BookingActions from '../../store/actions/booking.actions';
import { AppState } from '../../store/app.state';
import { selectSelectedExpert, selectSelectedService, selectSelectedDate, selectSelectedTimeSlot, selectSelectedDuration, selectSelectedAddress, selectPricing } from '../../store/selectors/booking.selectors';
import { Service, Expert, TimeSlot, Address } from '../../store/models/booking.model';

@Component({
  selector: 'app-modify-booking',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    if (this.bookingId) {
      this.loadBookingDetails();
    } else {
      this.error = 'No booking ID provided';
      this.isLoading = false;
    }
  }

  loadBookingDetails() {
    if (!this.bookingId) return;

    this.isLoading = true;
    this.error = null;

    this.bookingService.getBookingById(+this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.originalAmount = booking.totalAmount;
        // Determine paid amount based on status and payment status
        if (booking.paymentStatus === 'paid' || booking.status === 'upcoming' || booking.status === 'completed') {
          this.amountPaid = booking.totalAmount;
        } else {
          this.amountPaid = 0;
        }
        this.isLoading = false;
        this.calculateAmounts();
      },
      error: (error) => {
        console.error('Error loading booking details:', error);
        this.error = 'Failed to load booking details';
        this.isLoading = false;
      }
    });
  }

  editExpert() {
    // Open expert selection in a dialog or navigate
    console.log('Edit expert - to be implemented');
    // TODO: Implement expert selection modal
  }

  editService() {
    // Open service selection in a dialog or navigate
    console.log('Edit service - to be implemented');
    // TODO: Implement service selection modal
  }

  editSchedule() {
    // Open schedule editor in a dialog or navigate
    console.log('Edit schedule - to be implemented');
    // TODO: Implement schedule editor modal
  }

  editAddress() {
    // Open address selection/editor in a dialog or navigate
    console.log('Edit address - to be implemented');
    // TODO: Implement address selection modal
  }

  calculateAmounts() {
    if (!this.booking) return;
    
    // If nothing modified, amounts stay the same
    this.newAmount = this.originalAmount;
    this.amountToPay = Math.max(0, this.newAmount - this.amountPaid);
    
    // TODO: Recalculate based on modifications
    // This would involve:
    // 1. Getting new expert's pricePerHour if expert changed
    // 2. Recalculating baseAmount = pricePerHour * duration
    // 3. Adding GST (18%)
    // 4. Subtracting discount if coupon still applies
  }

  cancelBooking() {
    this.router.navigate(['/booking-details', this.bookingId]);
  }

  confirmChanges() {
    if (!this.booking?.id) return;

    // If amount to pay > 0, open payment modal
    if (this.amountToPay > 0) {
      this.openPaymentModal();
    } else {
      // Save changes without payment
      this.saveChanges();
    }
  }

  openPaymentModal() {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '500px',
      disableClose: true,
      data: { amount: this.amountToPay }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.saveChanges(result.transactionId);
      }
    });
  }

  saveChanges(transactionId?: string) {
    if (!this.booking?.id) return;

    const updates: Partial<SavedBooking> = {};
    
    // Add modified fields to updates
    // TODO: Build updates object from modified fields
    
    if (transactionId) {
      updates.transactionId = transactionId;
    }

    this.bookingService.updateBooking(+this.booking.id, updates).subscribe({
      next: () => {
        this.router.navigate(['/booking-details', this.booking!.id]);
      },
      error: (error) => {
        console.error('Error updating booking:', error);
        this.error = 'Failed to update booking';
      }
    });
  }

  goBack() {
    this.router.navigate(['/booking-details', this.bookingId]);
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
