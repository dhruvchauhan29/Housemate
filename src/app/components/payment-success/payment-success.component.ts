import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { resetBooking } from '../../store/actions/booking.actions';
import { selectBooking } from '../../store/selectors/booking.selectors';
import { BookingService, SavedBooking } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {
  private router = inject(Router);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<PaymentSuccessComponent>);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  public data = inject(MAT_DIALOG_DATA) as { transactionId: string };

  constructor() {
    // Save booking when component initializes
    this.saveBooking();
  }

  private saveBooking(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    this.store.select(selectBooking).pipe(take(1)).subscribe(booking => {
      if (!booking.service || !booking.expert || !booking.date || !booking.timeSlot || !booking.address) {
        console.error('Incomplete booking data');
        return;
      }

      const savedBooking: SavedBooking = {
        customerId: currentUser.id!,
        serviceName: booking.service.name,
        serviceIcon: this.getServiceIcon(booking.service.name),
        expertName: booking.expert.name,
        expertId: parseInt(booking.expert.id),
        date: booking.date,
        timeSlot: `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`,
        duration: booking.duration || 0,
        address: `${booking.address.serviceAddress}, ${booking.address.city}, ${booking.address.state} - ${booking.address.pinCode}`,
        baseAmount: booking.baseAmount || 0,
        gst: booking.gst || 0,
        discount: booking.discount || 0,
        totalAmount: booking.totalAmount || 0,
        couponCode: booking.coupon?.code,
        transactionId: this.data.transactionId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.bookingService.saveBooking(savedBooking).subscribe({
        next: (response) => {
          console.log('Booking saved successfully:', response);
        },
        error: (error) => {
          console.error('Error saving booking:', error);
        }
      });
    });
  }

  private getServiceIcon(serviceName: string): string {
    const iconMap: { [key: string]: string } = {
      'Cleaning': '🧹',
      'Cooking': '👨‍🍳',
      'Gardening': '🌱',
      'Plumbing': '🔧',
      'Electrical': '💡',
      'Carpentry': '🔨'
    };
    return iconMap[serviceName] || '🏠';
  }

  closeAndRedirect(): void {
    this.dialogRef.close();
    this.store.dispatch(resetBooking());
    this.router.navigate(['/customer/dashboard']);
  }
}

