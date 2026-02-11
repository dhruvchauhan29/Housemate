import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { TimeSlot } from '../../store/models/booking.model';
import { ScheduleUtils } from '../../utils/schedule.utils';

export interface ScheduleData {
  date: string;
  timeSlot: string;
  duration: number;
}

@Component({
  selector: 'app-schedule-editor-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './schedule-editor-modal.component.html',
  styleUrl: './schedule-editor-modal.component.scss'
})
export class ScheduleEditorModalComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedTimeSlot: TimeSlot | null = null;
  selectedDuration: number = 1;
  
  timeSlots: TimeSlot[] = ScheduleUtils.AVAILABLE_TIME_SLOTS;
  durationOptions: number[] = ScheduleUtils.DURATION_OPTIONS;
  
  minDate: Date = new Date(); // Today

  constructor(
    private dialogRef: MatDialogRef<ScheduleEditorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      currentDate?: string;
      currentTimeSlot?: string;
      currentDuration?: number;
    }
  ) {}

  ngOnInit() {
    // Pre-select current values if provided
    if (this.data.currentDate) {
      this.selectedDate = new Date(this.data.currentDate);
    }
    
    if (this.data.currentTimeSlot) {
      this.selectedTimeSlot = this.timeSlots.find(ts => 
        `${ts.startTime} - ${ts.endTime}` === this.data.currentTimeSlot
      ) || null;
    }
    
    if (this.data.currentDuration) {
      this.selectedDuration = this.data.currentDuration;
    }
  }

  selectTimeSlot(slot: TimeSlot) {
    if (slot.available) {
      this.selectedTimeSlot = slot;
    }
  }

  confirm() {
    if (this.selectedDate && this.selectedTimeSlot && this.selectedDuration) {
      const result: ScheduleData = {
        date: this.selectedDate.toISOString().split('T')[0],
        timeSlot: ScheduleUtils.getTimeSlotDisplay(this.selectedTimeSlot),
        duration: this.selectedDuration
      };
      this.dialogRef.close(result);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getTimeSlotDisplay(slot: TimeSlot): string {
    return ScheduleUtils.getTimeSlotDisplay(slot);
  }

  isFormValid(): boolean {
    return !!(this.selectedDate && this.selectedTimeSlot && this.selectedDuration);
  }
}
