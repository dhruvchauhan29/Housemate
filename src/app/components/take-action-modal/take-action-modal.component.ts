import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SavedBooking, BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-take-action-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './take-action-modal.component.html',
  styleUrl: './take-action-modal.component.scss'
})
export class TakeActionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TakeActionModalComponent>);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  public data = inject(MAT_DIALOG_DATA) as { booking: SavedBooking };

  processing: boolean = false;
  errorMessage: string = '';
  rejectForm: FormGroup;
  showRejectForm: boolean = false;
  customerName: string = 'Customer';

  rejectionReasons = [
    'Schedule conflict',
    'Service area unavailable',
    'Personal emergency',
    'Insufficient expertise',
    'Other'
  ];

  constructor() {
    this.rejectForm = this.fb.group({
      reason: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Try to fetch customer name if not already present
    if (!this.booking.customerName && this.booking.customerId) {
      this.authService.getCustomerById(this.booking.customerId).subscribe({
        next: (customer) => {
          this.customerName = customer.fullName;
        },
        error: (err) => {
          console.error('Error fetching customer details:', err);
          // Keep default 'Customer' if fetch fails
        }
      });
    } else if (this.booking.customerName) {
      this.customerName = this.booking.customerName;
    }
  }

  get booking(): SavedBooking {
    return this.data.booking;
  }

  acceptBooking(): void {
    if (this.processing) return;

    // Check if booking status is still pending (defensive check for stale state)
    if (this.booking.status !== 'pending') {
      this.errorMessage = 'This booking has already been processed or cancelled.';
      return;
    }

    this.processing = true;
    this.errorMessage = '';

    this.bookingService.acceptBooking(this.booking.id!).subscribe({
      next: (updatedBooking) => {
        this.processing = false;
        this.dialogRef.close({ action: 'accepted', booking: updatedBooking });
      },
      error: (error) => {
        this.processing = false;
        // Check if error is due to concurrent modification
        if (error.status === 409 || error.status === 404) {
          this.errorMessage = 'This booking has been modified or cancelled. Please refresh and try again.';
        } else {
          this.errorMessage = 'Failed to accept booking. Please try again.';
        }
        console.error('Error accepting booking:', error);
      }
    });
  }

  showRejectConfirmation(): void {
    this.showRejectForm = true;
  }

  cancelReject(): void {
    this.showRejectForm = false;
    this.rejectForm.reset();
  }

  rejectBooking(): void {
    if (this.processing || this.rejectForm.invalid) {
      this.rejectForm.markAllAsTouched();
      return;
    }

    // Check if booking status is still pending (defensive check for stale state)
    if (this.booking.status !== 'pending') {
      this.errorMessage = 'This booking has already been processed or cancelled.';
      return;
    }

    this.processing = true;
    this.errorMessage = '';

    const { reason, notes } = this.rejectForm.value;

    this.bookingService.rejectBooking(this.booking.id!, reason, notes).subscribe({
      next: (updatedBooking) => {
        this.processing = false;
        this.dialogRef.close({ action: 'rejected', booking: updatedBooking });
      },
      error: (error) => {
        this.processing = false;
        // Check if error is due to concurrent modification
        if (error.status === 409 || error.status === 404) {
          this.errorMessage = 'This booking has been modified or cancelled. Please refresh and try again.';
        } else {
          this.errorMessage = 'Failed to reject booking. Please try again.';
        }
        console.error('Error rejecting booking:', error);
      }
    });
  }

  getCustomerName(): string {
    return this.customerName;
  }

  close(): void {
    this.dialogRef.close();
  }

  getServiceIcon(serviceName: string): string {
    const iconMap: { [key: string]: string } = {
      'Cooking': 'restaurant',
      'Gardening': 'yard',
      'Cleaning': 'cleaning_services',
      'Electrician': 'electrical_services',
      'Plumbing': 'plumbing',
      'Deep Cleaning': 'cleaning_services',
      'Kitchen Cleaning': 'restaurant'
    };
    return iconMap[serviceName] || 'home_repair_service';
  }
}
