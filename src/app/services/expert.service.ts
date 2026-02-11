import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expert {
  id: number;
  email: string;
  fullName: string;
  age?: number;
  address?: string;
  mobileNumber: string;
  serviceCategory: string;
  experience: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
  verified?: boolean;
  languages?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:3000/experts';

  constructor(private http: HttpClient) {}

  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(this.apiUrl);
  }

  getExpertById(id: number): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/${id}`);
  }

  getExpertsByService(serviceCategory: string): Observable<Expert[]> {
    return this.http.get<Expert[]>(`${this.apiUrl}?serviceCategory=${serviceCategory}`);
  }
}
