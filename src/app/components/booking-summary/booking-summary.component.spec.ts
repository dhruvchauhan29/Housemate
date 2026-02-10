import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BookingSummaryComponent } from './booking-summary.component';
import { AppState } from '../../store/app.state';
import { applyCoupon, removeCoupon, calculateTotal } from '../../store/actions/booking.actions';

describe('BookingSummaryComponent', () => {
  let component: BookingSummaryComponent;
  let fixture: ComponentFixture<BookingSummaryComponent>;
  let store: MockStore<AppState>;

  const mockBooking = {
    service: { id: '1', name: 'Cleaning', description: 'Test', pricePerHour: 150 },
    expert: { 
      id: '1', 
      name: 'Test Expert', 
      rating: 4.5, 
      reviewCount: 100,
      experience: '5 years',
      distance: '2.3 km',
      pricePerHour: 150,
      verified: true,
      services: ['Cleaning'],
      languages: ['English']
    },
    date: '2024-01-01',
    frequency: 'Once' as const,
    timeSlot: { id: '1', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
    duration: 2,
    address: {
      id: '1',
      label: 'Home',
      serviceAddress: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pinCode: '123456',
      contactName: 'Test User',
      contactNumber: '1234567890',
      houseType: '2 BHK',
      isDefault: true
    },
    baseAmount: 300,
    gst: 54,
    discount: 0,
    totalAmount: 354
  };

  const initialState = {
    booking: {
      booking: mockBooking,
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
    await TestBed.configureTestingModule({
      imports: [
        BookingSummaryComponent,
        RouterTestingModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch calculateTotal on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(calculateTotal());
  });

  it('should apply valid coupon', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.couponCode = 'SAVE10';
    
    component.applyCouponCode();
    
    expect(dispatchSpy).toHaveBeenCalled();
    expect(component.couponError).toBe('');
  });

  it('should show error for invalid coupon', () => {
    component.couponCode = 'INVALID';
    
    component.applyCouponCode();
    
    expect(component.couponError).toBe('Invalid coupon code');
  });

  it('should show error for empty coupon', () => {
    component.couponCode = '';
    
    component.applyCouponCode();
    
    expect(component.couponError).toBe('Please enter a coupon code');
  });

  it('should remove applied coupon', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    
    component.removeCouponCode();
    
    expect(dispatchSpy).toHaveBeenCalledWith(removeCoupon());
    expect(component.couponCode).toBe('');
    expect(component.couponError).toBe('');
  });

  it('should navigate to previous step', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.previousStep();
    
    expect(routerSpy).toHaveBeenCalledWith(['/book-service/select-address']);
  });

  it('should navigate to edit address', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.editAddress();
    
    expect(routerSpy).toHaveBeenCalledWith(['/book-service/select-address']);
  });
});
