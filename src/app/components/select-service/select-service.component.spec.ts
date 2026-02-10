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

describe('SelectServiceComponent', () => {
  let component: SelectServiceComponent;
  let fixture: ComponentFixture<SelectServiceComponent>;
  let store: MockStore<AppState>;

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
    await TestBed.configureTestingModule({
      imports: [
        SelectServiceComponent,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
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

  it('should navigate to next step when service is selected', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.selectedServiceId = '1';
    
    component.nextStep();
    
    expect(routerSpy).toHaveBeenCalledWith(['/book-service/select-expert']);
  });

  it('should not navigate when no service is selected', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.selectedServiceId = null;
    
    component.nextStep();
    
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should return correct icon for service name', () => {
    expect(component.getServiceIcon('Cleaning')).toBe('🧹');
    expect(component.getServiceIcon('Cooking')).toBe('👨‍🍳');
    expect(component.getServiceIcon('Gardening')).toBe('🌱');
    expect(component.getServiceIcon('Unknown')).toBe('🏠');
  });
});
