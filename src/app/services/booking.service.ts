import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Booking {
  id: number;
  customerId: number;
  expertId: number;
  serviceId: number;
  serviceName: string;
  serviceIcon: string;
  expertName: string;
  expertRating: number;
  date: string;
  dateDisplay: string;
  time: string;
  timeSlot: string;
  duration: string;
  durationHours: number;
  frequency: string;
  location: string;
  price: number;
  priceDisplay: string;
  totalAmount: number;
  gst: number;
  discount: number;
  finalAmount: number;
  bookingStatus: 'upcoming' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'success' | 'failed';
  transactionId?: string;
  bookingDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Get all bookings for a specific customer
   */
  getBookingsByCustomerId(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings?customerId=${customerId}`);
  }

  /**
   * Get upcoming bookings for a customer (status = upcoming, payment = success)
   */
  getUpcomingBookings(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.apiUrl}/bookings?customerId=${customerId}&bookingStatus=upcoming&paymentStatus=success`
    ).pipe(
      map(bookings => bookings.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ))
    );
  }

  /**
   * Get a specific booking by ID
   */
  getBookingById(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  /**
   * Get completed bookings for a customer
   */
  getCompletedBookings(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.apiUrl}/bookings?customerId=${customerId}&bookingStatus=completed`
    );
  }
}
