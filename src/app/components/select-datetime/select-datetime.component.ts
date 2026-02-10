import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-datetime',
  imports: [CommonModule],
  templateUrl: './select-datetime.component.html',
  styleUrl: './select-datetime.component.scss'
})
export class SelectDatetimeComponent {
  constructor(private router: Router) {}

  nextStep() {
    this.router.navigate(['/book-service/select-address']);
  }

  previousStep() {
    this.router.navigate(['/book-service/select-expert']);
  }
}
