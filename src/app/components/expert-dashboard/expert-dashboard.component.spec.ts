import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ExpertDashboardComponent } from './expert-dashboard.component';
import { AppState } from '../../store/app.state';
import { AuthService, User } from '../../services/auth.service';

describe('ExpertDashboardComponent', () => {
  let component: ExpertDashboardComponent;
  let fixture: ComponentFixture<ExpertDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let store: MockStore<AppState>;

  const mockUser: User = {
    id: 1,
    email: 'expert@example.com',
    fullName: 'Test Expert',
    age: 28,
    address: 'Test Address',
    mobileNumber: '1234567890',
    role: 'EXPERT',
    serviceCategory: 'Cleaning',
    experience: '5 years',
    idProof: 'test.jpg'
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
        ExpertDashboardComponent,
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

  it('should have mock stats', () => {
    expect(component.mockStats).toBeDefined();
    expect(component.mockStats.totalJobs).toBe(2);
    expect(component.mockStats.upcomingJobs).toBe(5);
    expect(component.mockStats.totalEarnings).toBe(5700);
    expect(component.mockStats.averageRating).toBe(4.7);
  });

  it('should have mock jobs', () => {
    expect(component.mockJobs).toBeDefined();
    expect(component.mockJobs.length).toBeGreaterThan(0);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Pending')).toBe('status-pending');
    expect(component.getStatusClass('Accepted')).toBe('status-accepted');
    expect(component.getStatusClass('Rejected')).toBe('status-rejected');
    expect(component.getStatusClass('Completed')).toBe('status-completed');
    expect(component.getStatusClass('Cancelled')).toBe('status-cancelled');
    expect(component.getStatusClass('Unknown')).toBe('');
  });

  it('should navigate to home', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToHome();
    
    expect(routerSpy).toHaveBeenCalledWith(['/']);
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
