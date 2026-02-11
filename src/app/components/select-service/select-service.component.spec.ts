import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SelectServiceComponent } from './select-service.component';
import { AppState } from '../../store/app.state';
import { selectSelectedService } from '../../store/selectors/booking.selectors';
import { selectService } from '../../store/actions/booking.actions';
import { ExpertService } from '../../services/expert.service';
import { of } from 'rxjs';

describe('SelectServiceComponent', () => {
  let component: SelectServiceComponent;
  let fixture: ComponentFixture<SelectServiceComponent>;
  let store: MockStore<AppState>;
  let expertService: jasmine.SpyObj<ExpertService>;

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
    const expertServiceSpy = jasmine.createSpyObj('ExpertService', ['searchExperts']);
    expertServiceSpy.searchExperts.and.returnValue(of({ experts: [], total: 0 }));

    await TestBed.configureTestingModule({
      imports: [
        SelectServiceComponent,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ExpertService, useValue: expertServiceSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    expertService = TestBed.inject(ExpertService) as jasmine.SpyObj<ExpertService>;
    fixture = TestBed.createComponent(SelectServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of services', () => {
    expect(component.services).toBeDefined();
    expect(component.services.length).toBeGreaterThan(0);
  });

  it('should select a service when clicked', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const service = component.services[0];
    
    component.selectServiceCard(service);
    
    expect(component.selectedServiceId).toBe(service.id);
    expect(dispatchSpy).toHaveBeenCalledWith(selectService({ service }));
  });

  it('should return correct icon for service name', () => {
    expect(component.getServiceIcon('Cleaning')).toBe('🧹');
    expect(component.getServiceIcon('Cooking')).toBe('👨‍🍳');
    expect(component.getServiceIcon('Gardening')).toBe('🌱');
    expect(component.getServiceIcon('Unknown')).toBe('🏠');
  });

  it('should load experts on initialization', () => {
    spyOn(component, 'loadExperts');
    component.ngOnInit();
    expect(component.loadExperts).toHaveBeenCalled();
  });

  it('should filter experts by name when search query changes', () => {
    const searchQuery = 'John';
    component.onSearchChange(searchQuery);
    expect(component.searchQuery).toBe(searchQuery);
  });

  it('should clear filters and reset pagination', () => {
    component.searchQuery = 'test';
    component.minRating = 4.5;
    component.verifiedOnly = true;
    component.currentPage = 3;

    component.clearFilters();

    expect(component.searchQuery).toBe('');
    expect(component.minRating).toBe(0);
    expect(component.verifiedOnly).toBe(false);
    expect(component.currentPage).toBe(1);
  });
});
