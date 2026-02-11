import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { AppState } from '../../store/app.state';
import { AuthService, User } from '../../services/auth.service';

describe('CustomerDashboardComponent', () => {
  let component: CustomerDashboardComponent;
  let fixture: ComponentFixture<CustomerDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let store: MockStore<AppState>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'test123',
    fullName: 'Test User',
    age: 30,
    address: 'Test Address',
    mobileNumber: '1234567890',
    role: 'CUSTOMER'
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

    await TestBed.configureTestingModule({
      imports: [
        CustomerDashboardComponent,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authService.getCurrentUser.and.returnValue(mockUser);
    
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CustomerDashboardComponent);
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

  it('should navigate to home', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToHome();
    
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to book service', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToBookService();
    
    expect(routerSpy).toHaveBeenCalledWith(['/book-service']);
  });

  it('should logout and navigate to home', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.logout();
    
    expect(authService.logout).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should display user name in template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockUser.fullName);
  });
});
