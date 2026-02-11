import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ExpertDashboardComponent } from './expert-dashboard.component';
import { AppState } from '../../store/app.state';
import { AuthService, User } from '../../services/auth.service';
import { BookingService, SavedBooking } from '../../services/booking.service';

describe('ExpertDashboardComponent', () => {
  let component: ExpertDashboardComponent;
  let fixture: ComponentFixture<ExpertDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let store: MockStore<AppState>;

  const mockUser: User = {
    id: 1,
    email: 'expert@example.com',
    password: 'test123',
    fullName: 'Test Expert',
    age: 28,
    address: 'Test Address',
    mobileNumber: '1234567890',
    role: 'EXPERT',
    serviceCategory: 'Cleaning',
    experience: '5 years',
    idProof: 'test.jpg'
  };

  const mockUpcomingBooking: SavedBooking = {
    id: 1,
    customerId: 2,
    customerName: 'Test Customer',
    serviceName: 'Cleaning',
    serviceIcon: 'cleaning_services',
    expertName: 'Test Expert',
    expertId: 1,
    date: '2026-02-15',
    timeSlot: '10:00 AM - 12:00 PM',
    duration: 2,
    address: '123 Test St, Test City',
    baseAmount: 500,
    gst: 90,
    discount: 0,
    totalAmount: 590,
    transactionId: 'TXN123',
    status: 'upcoming',
    createdAt: '2026-02-11T00:00:00.000Z'
  };

  const mockPendingBooking: SavedBooking = {
    ...mockUpcomingBooking,
    id: 2,
    status: 'pending'
  };

  const mockCompletedBooking: SavedBooking = {
    ...mockUpcomingBooking,
    id: 3,
    status: 'completed'
  };

  const initialState = {
    booking: {
      booking: {},
      addresses: [],
      payment: {
        status: 'IDLE' as const
      }
    },
    expert: {
      jobs: [],
      stats: null,
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'getBookingsByExpertId',
      'completeBooking',
      'acceptBooking',
      'rejectBooking'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ExpertDashboardComponent,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: BookingService, useValue: bookingServiceSpy },
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    authService.getCurrentUser.and.returnValue(mockUser);
    bookingService.getBookingsByExpertId.and.returnValue(of([]));
    
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ExpertDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser).toEqual(mockUser);
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('should have calculated stats', () => {
    expect(component.calculatedStats).toBeDefined();
    expect(component.calculatedStats.todayJobs).toBeDefined();
    expect(component.calculatedStats.weekJobs).toBeDefined();
    expect(component.calculatedStats.totalEarnings).toBeDefined();
    expect(component.calculatedStats.averageRating).toBeDefined();
  });

  it('should have pending jobs array', () => {
    expect(component.pendingJobs).toBeDefined();
    expect(Array.isArray(component.pendingJobs)).toBe(true);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('pending')).toBe('status-pending');
    expect(component.getStatusClass('upcoming')).toBe('status-upcoming');
    expect(component.getStatusClass('rejected')).toBe('status-rejected');
    expect(component.getStatusClass('completed')).toBe('status-completed');
    expect(component.getStatusClass('cancelled')).toBe('status-cancelled');
    expect(component.getStatusClass('cancelled_by_customer')).toBe('status-cancelled-by-customer');
  });

  it('should navigate to home', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToHome();
    
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should logout and navigate to expert login', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.logout();
    
    expect(authService.logout).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/expert/login']);
  });

  it('should display user name in template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockUser.fullName);
  });

  // Tests for Mark as Completed functionality
  describe('canMarkComplete', () => {
    it('should return true for upcoming bookings', () => {
      expect(component.canMarkComplete(mockUpcomingBooking)).toBe(true);
    });

    it('should return false for pending bookings', () => {
      expect(component.canMarkComplete(mockPendingBooking)).toBe(false);
    });

    it('should return false for completed bookings', () => {
      expect(component.canMarkComplete(mockCompletedBooking)).toBe(false);
    });
  });

  describe('markAsCompleted', () => {
    beforeEach(() => {
      spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should call bookingService.completeBooking with correct booking id', () => {
      bookingService.completeBooking.and.returnValue(of(mockCompletedBooking));
      
      component.markAsCompleted(mockUpcomingBooking);
      
      expect(bookingService.completeBooking).toHaveBeenCalledWith(1);
    });

    it('should reload bookings after successful completion', () => {
      bookingService.completeBooking.and.returnValue(of(mockCompletedBooking));
      spyOn(component, 'loadBookings');
      
      component.markAsCompleted(mockUpcomingBooking);
      
      expect(component.loadBookings).toHaveBeenCalled();
    });

    it('should handle error when completing booking fails', () => {
      bookingService.completeBooking.and.returnValue(throwError(() => new Error('Network error')));
      
      component.markAsCompleted(mockUpcomingBooking);
      
      expect(component.loading).toBe(false);
    });

    it('should not call service if user cancels confirmation', () => {
      (window.confirm as jasmine.Spy).and.returnValue(false);
      
      component.markAsCompleted(mockUpcomingBooking);
      
      expect(bookingService.completeBooking).not.toHaveBeenCalled();
    });

    it('should show error if booking id is missing', () => {
      const bookingWithoutId = { ...mockUpcomingBooking, id: undefined };
      
      component.markAsCompleted(bookingWithoutId);
      
      expect(bookingService.completeBooking).not.toHaveBeenCalled();
    });
  });
});
