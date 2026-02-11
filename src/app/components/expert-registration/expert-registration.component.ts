import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
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
  selectedPhotoPreview: string | null = null;
  isSubmitting: boolean = false;

  services = [
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'cooking', name: 'Cooking', icon: '🍳' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' }
  ];

  years = Array.from({ length: 50 }, (_, i) => i);
  months = Array.from({ length: 12 }, (_, i) => i);

  idProofTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      // Step 1: Personal Information
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      completeAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      
      // Step 2: Service Profile
      servicesOffered: this.fb.array([], Validators.required),
      experienceYears: ['', Validators.required],
      experienceMonths: ['', Validators.required],
      specializations: [''],
      
      // Step 3: ID Verification
      idProofType: ['aadhar', Validators.required],
      idProofNumber: ['', Validators.required],
      photograph: ['', Validators.required]
    });
  }

  get servicesOfferedArray() {
    return this.registrationForm.get('servicesOffered') as FormArray;
  }

  toggleService(serviceId: string) {
    const index = this.servicesOfferedArray.value.indexOf(serviceId);
    if (index > -1) {
      this.servicesOfferedArray.removeAt(index);
    } else {
      this.servicesOfferedArray.push(this.fb.control(serviceId));
    }
    this.servicesOfferedArray.markAsTouched();
  }

  isServiceSelected(serviceId: string): boolean {
    return this.servicesOfferedArray.value.includes(serviceId);
  }

  nextStep() {
    this.errorMessage = '';
    if (this.currentStep === 1) {
      const step1Fields = ['fullName', 'mobileNumber', 'email', 'password', 'confirmPassword', 'dateOfBirth', 'completeAddress', 'city', 'state', 'pinCode'];
      const step1Valid = step1Fields.every(field => this.registrationForm.get(field)?.valid);
      
      // Check if passwords match
      const password = this.registrationForm.get('password')?.value;
      const confirmPassword = this.registrationForm.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        this.registrationForm.get('confirmPassword')?.setErrors({ mismatch: true });
        this.errorMessage = 'Passwords do not match';
        return;
      }
      
      if (step1Valid) {
        this.currentStep++;
      } else {
        step1Fields.forEach(field => this.registrationForm.get(field)?.markAsTouched());
        this.errorMessage = 'Please fill all required fields correctly';
      }
    } else if (this.currentStep === 2) {
      const step2Valid = this.servicesOfferedArray.length > 0 && 
                         this.registrationForm.get('experienceYears')?.valid &&
                         this.registrationForm.get('experienceMonths')?.valid;
      if (step2Valid) {
        this.currentStep++;
      } else {
        this.servicesOfferedArray.markAsTouched();
        this.registrationForm.get('experienceYears')?.markAsTouched();
        this.registrationForm.get('experienceMonths')?.markAsTouched();
        this.errorMessage = 'Please fill all required fields';
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
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
      this.registrationForm.patchValue({ photograph: file.name });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedPhotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const formData = this.registrationForm.value;
      
      const expert: User = {
        fullName: formData.fullName,
        mobileNumber: '+91' + formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        address: `${formData.completeAddress}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
        role: 'EXPERT' as const,
        serviceCategory: formData.servicesOffered.join(', '),
        experience: `${formData.experienceYears} years ${formData.experienceMonths} months`,
        idProof: formData.idProofType + ': ' + formData.idProofNumber
      };
      
      this.authService.registerExpert(expert).subscribe({
        next: (user) => {
          this.isSubmitting = false;
          // TODO: Show success message with instructions to check SMS for password
          this.router.navigate(['/expert/dashboard']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly';
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToCustomerLogin() {
    this.router.navigate(['/customer/login']);
  }

  navigateToExpertLogin() {
    this.router.navigate(['/expert/login']);
  }
}

