import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppState } from '../../store/app.state';
import { Service, Expert } from '../../store/models/booking.model';
import { selectService } from '../../store/actions/booking.actions';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent implements OnInit, OnDestroy {
  selectedService$: Observable<Service | undefined>;
  selectedExpert$: Observable<Expert | undefined>;
  selectedServiceId: string | null = null;
  selectedExpert: Expert | undefined;
  private destroy$ = new Subject<void>();

  services: Service[] = [
    {
      id: '1',
      name: 'Cleaning',
      description: 'Professional cleaning services',
      pricePerHour: 150,
    },
    {
      id: '2',
      name: 'Cooking',
      description: 'Expert cooking services',
      pricePerHour: 150,
    },
    {
      id: '3',
      name: 'Gardening',
      description: 'Garden maintenance services',
      pricePerHour: 150,
    },
    {
      id: '4',
      name: 'Cleaning',
      description: 'Professional cleaning services',
      pricePerHour: 150,
    },
    {
      id: '5',
      name: 'Gardening',
      description: 'Garden maintenance services',
      pricePerHour: 150,
    },
    {
      id: '6',
      name: 'Cooking',
      description: 'Expert cooking services',
      pricePerHour: 150,
    },
    {
      id: '7',
      name: 'Gardening',
      description: 'Garden maintenance services',
      pricePerHour: 150,
    },
    {
      id: '8',
      name: 'Cleaning',
      description: 'Professional cleaning services',
      pricePerHour: 150,
    }
  ];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.selectedService$ = this.store.select(selectSelectedService);
    this.selectedExpert$ = this.store.select(selectSelectedExpert);
  }

  ngOnInit() {
    this.selectedService$
      .pipe(takeUntil(this.destroy$))
      .subscribe(service => {
        this.selectedServiceId = service?.id || null;
      });

    this.selectedExpert$
      .pipe(takeUntil(this.destroy$))
      .subscribe(expert => {
        this.selectedExpert = expert;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectServiceCard(service: Service) {
    this.selectedServiceId = service.id;
    this.store.dispatch(selectService({ service }));
  }

  getServiceIcon(serviceName: string): string {
    const icons: { [key: string]: string } = {
      'Cleaning': '🧹',
      'Cooking': '👨‍🍳',
      'Gardening': '🌱'
    };
    return icons[serviceName] || '🏠';
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}

