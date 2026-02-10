import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { selectBooking, selectPricing, selectPaymentStatus } from '../../store/selectors/booking.selectors';
import { applyCoupon, removeCoupon, calculateTotal } from '../../store/actions/booking.actions';
import { Coupon } from '../../store/models/booking.model';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss'
})
export class BookingSummaryComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // Store observables
  booking$ = this.store.select(selectBooking);
  pricing$ = this.store.select(selectPricing);
  paymentStatus$ = this.store.select(selectPaymentStatus);

  // Coupon properties
  couponCode = '';
  couponError = '';

  // Mock available coupons
  private availableCoupons = {
    'SAVE10': { id: '1', code: 'SAVE10', discount: 10, discountType: 'PERCENTAGE' as const, valid: true },
    'FLAT50': { id: '2', code: 'FLAT50', discount: 50, discountType: 'FIXED' as const, valid: true }
  };

  ngOnInit() {
    // Calculate total on component initialization
    this.store.dispatch(calculateTotal());
  }

  applyCouponCode() {
    if (!this.couponCode.trim()) {
      this.couponError = 'Please enter a coupon code';
      return;
    }

    const couponKey = this.couponCode.toUpperCase();
    const coupon = this.availableCoupons[couponKey as keyof typeof this.availableCoupons];

    if (coupon) {
      this.store.dispatch(applyCoupon({ coupon }));
      this.couponError = '';
      this.couponCode = '';
    } else {
      this.couponError = 'Invalid coupon code';
    }
  }

  removeCouponCode() {
    this.store.dispatch(removeCoupon());
    this.couponError = '';
  }

  calculateTotal() {
    this.store.dispatch(calculateTotal());
  }

  openPaymentModal() {
    this.pricing$.subscribe(pricing => {
      const dialogRef = this.dialog.open(PaymentModalComponent, {
        width: '500px',
        data: { amount: pricing.totalAmount },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.success) {
          // Handle successful payment
          this.router.navigate(['/payment-success']);
        } else if (result?.error) {
          // Handle payment failure
          this.router.navigate(['/payment-error']);
        }
      });
    }).unsubscribe();
  }

  previousStep() {
    this.router.navigate(['/book-service/select-address']);
  }

  editAddress() {
    this.router.navigate(['/book-service/select-address']);
  }
}
