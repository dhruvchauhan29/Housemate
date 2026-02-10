import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-book-service',
  imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.scss'
})
export class BookServiceComponent {
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  navigateHome() {
    this.router.navigate(['/customer/dashboard']);
  }

  navigateToServices() {
    this.router.navigate(['/book-service']);
  }
}

