import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  features = [
    {
      title: 'Verified Experts',
      description: 'All experts undergo KYC verification and background checks'
    },
    {
      title: 'Fast Service',
      description: 'ASAP bookings or schedule up to 4 days in advance'
    },
    {
      title: 'Quality Assurance',
      description: 'OTP-verified service start and customer ratings'
    },
    {
      title: 'Expert Support',
      description: 'OTP-verified service start and customer ratings'
    }
  ];

  constructor(private router: Router) {}

  navigateToCustomerLogin() {
    this.router.navigate(['/customer/login']);
  }

  navigateToExpertLogin() {
    this.router.navigate(['/expert/login']);
  }

  navigateToCustomerRegistration() {
    this.router.navigate(['/customer/register']);
  }

  navigateToExpertRegistration() {
    this.router.navigate(['/expert/register']);
  }
}

