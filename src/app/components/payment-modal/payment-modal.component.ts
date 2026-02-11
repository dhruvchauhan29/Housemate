import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { initiatePayment, paymentSuccess, paymentFailure } from '../../store/actions/booking.actions';
import { PaymentSuccessComponent } from '../payment-success/payment-success.component';
import { PaymentErrorComponent } from '../payment-error/payment-error.component';

@Component({
  selector: 'app-payment-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<PaymentModalComponent>);
  public data = inject(MAT_DIALOG_DATA) as { totalAmount: number; baseAmount: number; gst: number };

  paymentMethod: 'card' | 'upi' | 'netbanking' = 'card';
  cardPaymentForm!: FormGroup;
  upiId: string = '';
  processing: boolean = false;
  private paymentAttemptId: string | null = null;

  ngOnInit(): void {
    // Generate unique payment attempt ID for idempotency using crypto API
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      this.paymentAttemptId = 'PA-' + crypto.randomUUID();
    } else {
      // Fallback for environments without crypto.randomUUID
      this.paymentAttemptId = 'PA-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    }
    
    this.cardPaymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  processPayment(): void {
    if (this.processing) return;

    // Validate based on payment method
    if (this.paymentMethod === 'card' && this.cardPaymentForm.invalid) {
      Object.keys(this.cardPaymentForm.controls).forEach(key => {
        this.cardPaymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.paymentMethod === 'upi' && !this.upiId) {
      return;
    }

    this.processing = true;
    this.store.dispatch(initiatePayment());

    // Simulate payment processing with idempotency check
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        const transactionId = this.paymentAttemptId + '-' + Date.now();
        this.store.dispatch(paymentSuccess({ transactionId }));
        this.dialogRef.close();
        this.dialog.open(PaymentSuccessComponent, {
          width: '400px',
          disableClose: true,
          data: { transactionId }
        });
      } else {
        const errorMessage = 'Payment processing failed. Please try again.';
        this.store.dispatch(paymentFailure({ message: errorMessage }));
        this.processing = false;
        this.dialogRef.close();
        
        const errorDialogRef = this.dialog.open(PaymentErrorComponent, {
          width: '400px',
          data: { message: errorMessage }
        });

        errorDialogRef.afterClosed().subscribe(result => {
          if (result === 'retry') {
            // Reopen payment modal with new attempt ID
            this.dialog.open(PaymentModalComponent, {
              width: '680px',
              data: { 
                totalAmount: this.data.totalAmount,
                baseAmount: this.data.baseAmount,
                gst: this.data.gst
              },
              disableClose: true
            });
          }
        });
      }
    }, 2000);
  }

  close(): void {
    this.dialogRef.close();
  }
}
