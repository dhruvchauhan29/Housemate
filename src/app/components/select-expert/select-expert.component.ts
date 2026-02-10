import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Expert } from '../../store/models/booking.model';
import { selectExpert } from '../../store/actions/booking.actions';
import { selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { AppState } from '../../store/app.state';
import { MOCK_EXPERTS } from '../../shared/mock-data/experts.data';

@Component({
  selector: 'app-select-expert',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './select-expert.component.html',
  styleUrl: './select-expert.component.scss'
})
export class SelectExpertComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  selectedExpertId: string | undefined;
  selectedExpert$: Observable<Expert | undefined>;
  private destroy$ = new Subject<void>();
  
  mockExperts: Expert[] = MOCK_EXPERTS;

  filteredExperts: Expert[] = [];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.selectedExpert$ = this.store.select(selectSelectedExpert);
  }

  ngOnInit(): void {
    this.filteredExperts = this.mockExperts;
    
    this.selectedExpert$
      .pipe(takeUntil(this.destroy$))
      .subscribe(expert => {
        this.selectedExpertId = expert?.id;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredExperts = this.mockExperts;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredExperts = this.mockExperts.filter(expert =>
        expert.name.toLowerCase().includes(query)
      );
    }
  }

  selectExpertCard(expert: Expert): void {
    this.selectedExpertId = expert.id;
    this.store.dispatch(selectExpert({ expert }));
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  nextStep(): void {
    this.router.navigate(['/book-service/select-datetime']);
  }

  previousStep(): void {
    this.router.navigate(['/book-service/select-service']);
  }

  bookServiceWithExpert(expert: Expert): void {
    // Dispatch action to select the expert
    this.store.dispatch(selectExpert({ expert }));
    // Navigate to book-service with expertId as query parameter
    this.router.navigate(['/book-service'], { 
      queryParams: { expertId: expert.id }
    });
  }
}
