import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Service, Expert } from '../../store/models/booking.model';
import { selectService, selectExpert } from '../../store/actions/booking.actions';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-select-service-expert',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './select-service-expert.component.html',
  styleUrl: './select-service-expert.component.scss'
})
export class SelectServiceExpertComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchQuery: string = '';
  selectedServiceId: string | null = null;
  selectedExpertId: string | undefined;
  selectedService$: Observable<Service | undefined>;
  selectedExpert$: Observable<Expert | undefined>;

  services: Service[] = [
    {
      id: '1',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '2',
      name: 'Cooking',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '3',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '4',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '5',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '6',
      name: 'Cooking',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '7',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    },
    {
      id: '8',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      pricePerHour: 150,
    }
  ];

  mockExperts: Expert[] = [
    {
      id: '1',
      name: 'John Smith',
      rating: 4.8,
      reviewCount: 127,
      experience: '5 years',
      distance: '2.5 km',
      pricePerHour: 300,
      verified: true,
      services: ['House Cleaning', 'Deep Cleaning', 'Kitchen Cleaning'],
      languages: ['English', 'Hindi']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 203,
      experience: '7 years',
      distance: '3.2 km',
      pricePerHour: 350,
      verified: true,
      services: ['House Cleaning', 'Laundry', 'Ironing'],
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: '3',
      name: 'Michael Brown',
      rating: 4.7,
      reviewCount: 89,
      experience: '4 years',
      distance: '4.1 km',
      pricePerHour: 280,
      verified: true,
      services: ['Plumbing', 'Electrical', 'AC Repair'],
      languages: ['English', 'Hindi']
    },
    {
      id: '4',
      name: 'Emily Davis',
      rating: 4.6,
      reviewCount: 156,
      experience: '6 years',
      distance: '1.8 km',
      pricePerHour: 320,
      verified: false,
      services: ['House Cleaning', 'Window Cleaning', 'Carpet Cleaning'],
      languages: ['English', 'Hindi', 'Bengali']
    },
    {
      id: '5',
      name: 'David Wilson',
      rating: 4.9,
      reviewCount: 178,
      experience: '8 years',
      distance: '2.9 km',
      pricePerHour: 400,
      verified: true,
      services: ['Painting', 'Carpentry', 'Home Renovation'],
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      rating: 4.8,
      reviewCount: 134,
      experience: '5 years',
      distance: '3.5 km',
      pricePerHour: 310,
      verified: true,
      services: ['House Cleaning', 'Organizing', 'Decluttering'],
      languages: ['English', 'Hindi']
    }
  ];

  filteredExperts: Expert[] = [];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.selectedService$ = this.store.select(selectSelectedService);
    this.selectedExpert$ = this.store.select(selectSelectedExpert);
  }

  ngOnInit() {
    this.filteredExperts = this.mockExperts;

    this.selectedService$.pipe(takeUntil(this.destroy$)).subscribe(service => {
      this.selectedServiceId = service?.id || null;
    });

    this.selectedExpert$.pipe(takeUntil(this.destroy$)).subscribe(expert => {
      this.selectedExpertId = expert?.id;
    });
  }

  ngOnDestroy() {
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

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredExperts = this.mockExperts;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredExperts = this.mockExperts.filter(expert =>
        expert.name.toLowerCase().includes(query)
      );
    }
  }

  selectExpertCard(expert: Expert): void {
    this.selectedExpertId = expert.id;
    this.store.dispatch(selectExpert({ expert }));
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  nextStep(): void {
    if (this.selectedServiceId && this.selectedExpertId) {
      this.router.navigate(['/book-service/select-datetime']);
    }
  }
}
