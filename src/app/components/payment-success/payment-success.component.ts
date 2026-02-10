import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {
  isOpen = false;

  constructor(private router: Router) {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.router.navigate(['/customer/dashboard']);
  }
}
