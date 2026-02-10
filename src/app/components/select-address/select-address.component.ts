import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-address',
  imports: [CommonModule],
  templateUrl: './select-address.component.html',
  styleUrl: './select-address.component.scss'
})
export class SelectAddressComponent {
  constructor(private router: Router) {}

  nextStep() {
    this.router.navigate(['/book-service/booking-summary']);
  }

  previousStep() {
    this.router.navigate(['/book-service/select-datetime']);
  }
}
