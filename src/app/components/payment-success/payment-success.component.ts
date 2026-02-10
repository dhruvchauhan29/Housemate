import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { resetBooking } from '../../store/actions/booking.actions';

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
  public data = inject(MAT_DIALOG_DATA) as { transactionId: string };

  closeAndRedirect(): void {
    this.dialogRef.close();
    this.store.dispatch(resetBooking());
    this.router.navigate(['/customer/dashboard']);
  }
}
