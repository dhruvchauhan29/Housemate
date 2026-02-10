import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-expert',
  imports: [CommonModule],
  templateUrl: './select-expert.component.html',
  styleUrl: './select-expert.component.scss'
})
export class SelectExpertComponent {
  constructor(private router: Router) {}

  nextStep() {
    this.router.navigate(['/book-service/select-datetime']);
  }

  previousStep() {
    this.router.navigate(['/book-service/select-service']);
  }
}
