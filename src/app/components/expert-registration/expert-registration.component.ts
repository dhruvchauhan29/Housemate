import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-expert-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expert-registration.component.html',
  styleUrl: './expert-registration.component.scss'
})
export class ExpertRegistrationComponent {
  currentStep: number = 1;
  registrationForm: FormGroup;
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      // Step 1: Personal Details
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      address: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
      // Step 2: Professional Details
      serviceCategory: ['', Validators.required],
      experience: ['', Validators.required],
      
      // Step 3: ID Proof
      idProof: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      const step1Fields = ['fullName', 'age', 'address', 'mobileNumber', 'email', 'password'];
      const step1Valid = step1Fields.every(field => this.registrationForm.get(field)?.valid);
      if (step1Valid) {
        this.currentStep++;
      } else {
        step1Fields.forEach(field => this.registrationForm.get(field)?.markAsTouched());
      }
    } else if (this.currentStep === 2) {
      const step2Fields = ['serviceCategory', 'experience'];
      const step2Valid = step2Fields.every(field => this.registrationForm.get(field)?.valid);
      if (step2Valid) {
        this.currentStep++;
      } else {
        step2Fields.forEach(field => this.registrationForm.get(field)?.markAsTouched());
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Only JPG and PNG files are allowed';
        return;
      }
      
      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }
      
      this.selectedFile = file;
      this.registrationForm.patchValue({ idProof: file.name });
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const expert: User = {
        ...this.registrationForm.value,
        role: 'EXPERT' as const
      };
      
      this.authService.registerExpert(expert).subscribe({
        next: (user) => {
          this.router.navigate(['/expert/dashboard']);
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

