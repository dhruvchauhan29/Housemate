import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SavedBooking } from '../../services/booking.service';

export interface FeedbackData {
  booking: SavedBooking;
}

export interface FeedbackResult {
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-feedback-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.scss'
})
export class FeedbackModalComponent {
  rating = 0;
  hoveredRating = 0;
  comment = '';
  stars = [1, 2, 3, 4, 5];
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<FeedbackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedbackData
  ) {}

  setRating(rating: number) {
    this.rating = rating;
  }

  setHoveredRating(rating: number) {
    this.hoveredRating = rating;
  }

  clearHoveredRating() {
    this.hoveredRating = 0;
  }

  getStarIcon(star: number): string {
    const effectiveRating = this.hoveredRating || this.rating;
    return star <= effectiveRating ? 'star' : 'star_border';
  }

  getStarColor(star: number): string {
    const effectiveRating = this.hoveredRating || this.rating;
    return star <= effectiveRating ? 'gold' : '';
  }

  canSubmit(): boolean {
    return this.rating > 0 && this.comment.trim().length > 0;
  }

  submitFeedback() {
    if (!this.canSubmit() || this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Simulate API call with network latency
    // TODO: Replace with actual BookingService.submitFeedback() call in production
    setTimeout(() => {
      const result: FeedbackResult = {
        rating: this.rating,
        comment: this.comment.trim()
      };
      
      this.dialogRef.close(result);
    }, 500);
  }

  close() {
    this.dialogRef.close();
  }
}
