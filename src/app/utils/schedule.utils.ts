import { TimeSlot } from '../store/models/booking.model';

/**
 * Schedule and time slot utility functions
 */
export class ScheduleUtils {
  /**
   * Available time slots
   * TODO: Fetch from backend API to reflect real-time availability
   */
  static readonly AVAILABLE_TIME_SLOTS: TimeSlot[] = [
    { id: '1', startTime: '6:00 AM', endTime: '9:00 AM', available: true },
    { id: '2', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
    { id: '3', startTime: '12:00 PM', endTime: '3:00 PM', available: true },
    { id: '4', startTime: '3:00 PM', endTime: '6:00 PM', available: true },
    { id: '5', startTime: '6:00 PM', endTime: '9:00 PM', available: true }
  ];

  /**
   * Available duration options (in hours)
   */
  static readonly DURATION_OPTIONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * Get time slot display string
   * @param slot Time slot object
   * @returns Formatted time slot string
   */
  static getTimeSlotDisplay(slot: TimeSlot): string {
    return `${slot.startTime} - ${slot.endTime}`;
  }
}
