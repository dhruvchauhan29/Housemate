import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  password: string;
  fullName: string;
  age?: number;
  address?: string;
  mobileNumber: string;
  role: 'CUSTOMER' | 'EXPERT';
  serviceCategory?: string;
  experience?: string;
  idProof?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string, role: 'CUSTOMER' | 'EXPERT'): Observable<User | null> {
    const endpoint = role === 'CUSTOMER' ? 'customers' : 'experts';
    return this.http.get<User[]>(`${this.apiUrl}/${endpoint}?email=${email}&password=${password}`)
      .pipe(
        map(users => users.length > 0 ? users[0] : null),
        tap(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', 'mock-jwt-token');
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  registerCustomer(customer: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/customers`, customer)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', 'mock-jwt-token');
          this.currentUserSubject.next(user);
        })
      );
  }

  registerExpert(expert: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/experts`, expert)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', 'mock-jwt-token');
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): 'CUSTOMER' | 'EXPERT' | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}
