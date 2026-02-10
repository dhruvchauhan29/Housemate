import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent {
  constructor(private router: Router) {}

  nextStep() {
    this.router.navigate(['/book-service/select-expert']);
  }
}
