import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SavedBooking, BookingService } from '../../services/booking.service';

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
export class TakeActionModalComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TakeActionModalComponent>);
  private bookingService = inject(BookingService);
  public data = inject(MAT_DIALOG_DATA) as { booking: SavedBooking };

  processing: boolean = false;
  errorMessage: string = '';
  rejectForm: FormGroup;
  showRejectForm: boolean = false;

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

  get booking(): SavedBooking {
    return this.data.booking;
  }

  acceptBooking(): void {
    if (this.processing) return;

    this.processing = true;
    this.errorMessage = '';

    this.bookingService.acceptBooking(this.booking.id!).subscribe({
      next: (updatedBooking) => {
        this.processing = false;
        this.dialogRef.close({ action: 'accepted', booking: updatedBooking });
      },
      error: (error) => {
        this.processing = false;
        this.errorMessage = 'Failed to accept booking. Please try again.';
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
        this.errorMessage = 'Failed to reject booking. Please try again.';
        console.error('Error rejecting booking:', error);
      }
    });
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
