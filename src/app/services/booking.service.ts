import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SavedBooking {
  id?: number;
  customerId: number;
  serviceName: string;
  serviceIcon: string;
  expertName: string;
  expertId?: number;
  date: string;
  timeSlot: string;
  duration: number;
  address: string;
  baseAmount: number;
  gst: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  transactionId: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';

  constructor(private http: HttpClient) {}

  saveBooking(booking: SavedBooking): Observable<SavedBooking> {
    return this.http.post<SavedBooking>(this.apiUrl, booking);
  }

  getBookingsByCustomerId(customerId: number): Observable<SavedBooking[]> {
    return this.http.get<SavedBooking[]>(`${this.apiUrl}?customerId=${customerId}&status=upcoming`);
  }

  getAllBookings(): Observable<SavedBooking[]> {
    return this.http.get<SavedBooking[]>(this.apiUrl);
  }

  getBookingById(id: number): Observable<SavedBooking> {
    return this.http.get<SavedBooking>(`${this.apiUrl}/${id}`);
  }

  updateBooking(id: number, booking: Partial<SavedBooking>): Observable<SavedBooking> {
    return this.http.patch<SavedBooking>(`${this.apiUrl}/${id}`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
