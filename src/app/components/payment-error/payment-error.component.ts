import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-error',
  imports: [CommonModule],
  templateUrl: './payment-error.component.html',
  styleUrl: './payment-error.component.scss'
})
export class PaymentErrorComponent {
  isOpen = false;
  errorMessage = '';

  open(message: string = 'Payment failed. Please try again.') {
    this.errorMessage = message;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  retry() {
    this.close();
    // Retry logic will be implemented here
  }
}
