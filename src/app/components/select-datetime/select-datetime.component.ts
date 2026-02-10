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

  currentMonth: Date = new Date(2020, 8, 1); // September 2020
  secondMonth: Date = new Date(2020, 9, 1); // October 2020
  
  timeSlots: TimeSlot[] = [
    { id: '1', startTime: '6:00 AM', endTime: '9:00 AM', available: true },
    { id: '2', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
    { id: '3', startTime: '12:00 PM', endTime: '3:00 PM', available: true },
    { id: '4', startTime: '3:00 PM', endTime: '6:00 PM', available: true },
    { id: '5', startTime: '6:00 PM', endTime: '9:00 PM', available: true }
  ];

  selectedDate: string | undefined;
  selectedFrequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | undefined;
  selectedTimeSlotId: string | undefined;
  selectedDuration: number | undefined;
  selectedDay: number | null = null;
  selectedMonthIndex: number = 0; // 0 for current month, 1 for next month

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

  getDaysInMonth(date: Date): (number | null)[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }

  selectDate(day: number | null) {
    if (day) {
      this.selectedDay = day;
      this.selectedMonthIndex = 0;
      const dateString = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.store.dispatch(selectDate({ date: dateString }));
    }
  }

  selectDateNextMonth(day: number | null) {
    if (day) {
      this.selectedDay = day;
      this.selectedMonthIndex = 1;
      const dateString = `${this.secondMonth.getFullYear()}-${String(this.secondMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.store.dispatch(selectDate({ date: dateString }));
    }
  }

  isDateSelected(day: number | null, isNextMonth: boolean = false): boolean {
    if (!day || !this.selectedDay) return false;
    const monthIndex = isNextMonth ? 1 : 0;
    return day === this.selectedDay && monthIndex === this.selectedMonthIndex;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           this.currentMonth.getMonth() === today.getMonth() &&
           this.currentMonth.getFullYear() === today.getFullYear();
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.secondMonth = new Date(this.secondMonth.getFullYear(), this.secondMonth.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.secondMonth = new Date(this.secondMonth.getFullYear(), this.secondMonth.getMonth() + 1, 1);
  }

  onFrequencyChange(frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly') {
    this.store.dispatch(selectFrequency({ frequency }));
  }

  onTimeSlotSelect(timeSlot: TimeSlot) {
    if (timeSlot.available) {
      this.store.dispatch(selectTimeSlot({ timeSlot }));
    }
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
    this.router.navigate(['/book-service/select-service']);
  }
}
