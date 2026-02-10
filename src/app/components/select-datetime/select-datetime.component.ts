import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectDate, selectFrequency, selectTimeSlot, selectDuration } from '../../store/actions/booking.actions';
import { selectSelectedDate, selectSelectedFrequency, selectSelectedTimeSlot, selectSelectedDuration } from '../../store/selectors/booking.selectors';
import { TimeSlot } from '../../store/models/booking.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-datetime',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './select-datetime.component.html',
  styleUrl: './select-datetime.component.scss'
})
export class SelectDatetimeComponent implements OnInit {
  selectedDate$: Observable<string | undefined>;
  selectedFrequency$: Observable<'Once' | 'Daily' | 'Weekly' | 'Monthly' | undefined>;
  selectedTimeSlot$: Observable<TimeSlot | undefined>;
  selectedDuration$: Observable<number | undefined>;

  frequencyOptions: ('Once' | 'Daily' | 'Weekly' | 'Monthly')[] = ['Once', 'Daily', 'Weekly', 'Monthly'];
  
  timeSlots: TimeSlot[] = [
    { id: '1', startTime: '6:00 AM', endTime: '9:00 AM', available: true },
    { id: '2', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
    { id: '3', startTime: '12:00 PM', endTime: '3:00 PM', available: true },
    { id: '4', startTime: '3:00 PM', endTime: '6:00 PM', available: true },
    { id: '5', startTime: '6:00 PM', endTime: '9:00 PM', available: true }
  ];

  durationOptions: number[] = [1, 2, 3, 4];

  selectedDate: string | undefined;
  selectedFrequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | undefined;
  selectedTimeSlotId: string | undefined;
  selectedDuration: number | undefined;

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.selectedDate$ = this.store.select(selectSelectedDate);
    this.selectedFrequency$ = this.store.select(selectSelectedFrequency);
    this.selectedTimeSlot$ = this.store.select(selectSelectedTimeSlot);
    this.selectedDuration$ = this.store.select(selectSelectedDuration);
  }

  ngOnInit() {
    this.selectedDate$.subscribe(date => this.selectedDate = date);
    this.selectedFrequency$.subscribe(frequency => this.selectedFrequency = frequency);
    this.selectedTimeSlot$.subscribe(slot => this.selectedTimeSlotId = slot?.id);
    this.selectedDuration$.subscribe(duration => this.selectedDuration = duration);
  }

  onDateChange(date: Date | null) {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      this.store.dispatch(selectDate({ date: dateString }));
    }
  }

  onFrequencyChange(frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly') {
    this.store.dispatch(selectFrequency({ frequency }));
  }

  onTimeSlotSelect(timeSlot: TimeSlot) {
    if (timeSlot.available) {
      this.store.dispatch(selectTimeSlot({ timeSlot }));
    }
  }

  onDurationChange(duration: number) {
    this.store.dispatch(selectDuration({ duration }));
  }

  isTimeSlotSelected(timeSlotId: string): boolean {
    return this.selectedTimeSlotId === timeSlotId;
  }

  getTimeSlotDisplay(slot: TimeSlot): string {
    return `${slot.startTime} - ${slot.endTime}`;
  }

  nextStep() {
    this.router.navigate(['/book-service/select-address']);
  }

  previousStep() {
    this.router.navigate(['/book-service/select-expert']);
  }
}
