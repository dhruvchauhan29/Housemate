import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss'
})
export class CustomerLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password, 'CUSTOMER').subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/customer/dashboard']);
          } else {
            this.errorMessage = 'Invalid email or password';
          }
        },
        error: (err) => {
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/customer/register']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}

