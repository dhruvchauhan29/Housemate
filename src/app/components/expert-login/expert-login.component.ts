import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-expert-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expert-login.component.html',
  styleUrl: './expert-login.component.scss'
})
export class ExpertLoginComponent {
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
      this.authService.login(email, password, 'EXPERT').subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/expert/dashboard']);
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
    this.router.navigate(['/expert/register']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}

