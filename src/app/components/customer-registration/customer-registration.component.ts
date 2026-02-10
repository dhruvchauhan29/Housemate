import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-customer-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.scss'
})
export class CustomerRegistrationComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      address: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const customer: User = {
        ...this.registrationForm.value,
        role: 'CUSTOMER' as const
      };
      
      this.authService.registerCustomer(customer).subscribe({
        next: (user) => {
          this.router.navigate(['/customer/dashboard']);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}

