import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SavedBooking {
  id?: number | string;
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
  status: 'upcoming' | 'completed' | 'cancelled' | 'rejected' | 'pending';
  createdAt: string;
  rejectionReason?: string;
  rejectionNotes?: string;
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

  getBookingsByCustomerId(customerId: number, status?: string): Observable<SavedBooking[]> {
    const url = status 
      ? `${this.apiUrl}?customerId=${customerId}&status=${status}`
      : `${this.apiUrl}?customerId=${customerId}`;
    return this.http.get<SavedBooking[]>(url);
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

  // Expert-specific methods
  getBookingsByExpertId(expertId: number, status?: string): Observable<SavedBooking[]> {
    const url = status 
      ? `${this.apiUrl}?expertId=${expertId}&status=${status}`
      : `${this.apiUrl}?expertId=${expertId}`;
    return this.http.get<SavedBooking[]>(url);
  }

  acceptBooking(id: number | string): Observable<SavedBooking> {
    return this.http.patch<SavedBooking>(`${this.apiUrl}/${id}`, { status: 'upcoming' });
  }

  rejectBooking(id: number | string, reason?: string, notes?: string): Observable<SavedBooking> {
    return this.http.patch<SavedBooking>(`${this.apiUrl}/${id}`, { 
      status: 'rejected',
      rejectionReason: reason,
      rejectionNotes: notes
    });
  }
}
