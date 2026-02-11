import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ExpertService, Expert } from '../../services/expert.service';

@Component({
  selector: 'app-expert-selection-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './expert-selection-modal.component.html',
  styleUrl: './expert-selection-modal.component.scss'
})
export class ExpertSelectionModalComponent implements OnInit {
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  selectedExpert: Expert | null = null;
  isLoading = true;
  error: string | null = null;
  
  // Default values for missing expert data
  readonly DEFAULT_RATING = 4.5;
  readonly DEFAULT_REVIEWS_COUNT = 100;
  readonly DEFAULT_PRICE_PER_HOUR = 100;
  readonly DEFAULT_DISTANCE = '2.3 km away';

  constructor(
    private dialogRef: MatDialogRef<ExpertSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      serviceCategory: string;
      currentExpertId?: number;
    },
    private expertService: ExpertService
  ) {}

  ngOnInit() {
    this.loadExperts();
  }

  loadExperts() {
    this.isLoading = true;
    this.error = null;

    this.expertService.getExpertsByService(this.data.serviceCategory).subscribe({
      next: (experts) => {
        this.experts = experts;
        this.filteredExperts = experts;
        
        // Pre-select current expert if provided
        if (this.data.currentExpertId) {
          this.selectedExpert = experts.find(e => e.id === this.data.currentExpertId) || null;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading experts:', error);
        this.error = 'Failed to load experts. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectExpert(expert: Expert) {
    this.selectedExpert = expert;
  }

  confirm() {
    if (this.selectedExpert) {
      this.dialogRef.close({ expert: this.selectedExpert });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getExperienceYears(experience: string): string {
    const match = experience.match(/\d+/);
    return match ? match[0] : '0';
  }

  getRatingStars(rating?: number): string[] {
    const stars = [];
    const rate = rating || this.DEFAULT_RATING;
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push('star');
      } else if (i - 0.5 <= rate) {
        stars.push('star_half');
      } else {
        stars.push('star_border');
      }
    }
    return stars;
  }
}
