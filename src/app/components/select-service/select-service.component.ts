import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../../store/app.state';
import { Service, Expert } from '../../store/models/booking.model';
import { selectService, selectExpert } from '../../store/actions/booking.actions';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent implements OnInit {
  selectedService$: Observable<Service | undefined>;
  selectedExpert$: Observable<Expert | undefined>;
  selectedServiceId: string | null = null;
  selectedExpertId: string | null = null;

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

  filteredExperts: Expert[] = [
    {
      id: '1',
      name: 'Sara Khan',
      rating: 4.7,
      reviewCount: 122,
      experience: '8 years',
      distance: '2.3 km',
      pricePerHour: 299,
      verified: true,
      services: ['Cooking', 'Electrician'],
      languages: ['Hindi', 'English']
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      rating: 4.7,
      reviewCount: 122,
      experience: '8 years',
      distance: '2.3 km',
      pricePerHour: 299,
      verified: true,
      services: ['Cooking', 'Electrician'],
      languages: ['Hindi', 'English']
    },
    {
      id: '3',
      name: 'Priya Sharma',
      rating: 4.8,
      reviewCount: 156,
      experience: '6 years',
      distance: '1.8 km',
      pricePerHour: 320,
      verified: true,
      services: ['Cleaning', 'Organizing'],
      languages: ['Hindi', 'English', 'Marathi']
    },
    {
      id: '4',
      name: 'Amit Patel',
      rating: 4.6,
      reviewCount: 98,
      experience: '5 years',
      distance: '3.5 km',
      pricePerHour: 280,
      verified: true,
      services: ['Gardening', 'Landscaping'],
      languages: ['Hindi', 'English', 'Gujarati']
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
    this.selectedService$.subscribe(service => {
      this.selectedServiceId = service?.id || null;
    });
    this.selectedExpert$.subscribe(expert => {
      this.selectedExpertId = expert?.id || null;
    });
  }

  selectServiceCard(service: Service) {
    this.selectedServiceId = service.id;
    this.store.dispatch(selectService({ service }));
  }

  selectExpertCard(expert: Expert) {
    this.selectedExpertId = expert.id;
    this.store.dispatch(selectExpert({ expert }));
  }

  getServiceIcon(serviceName: string): string {
    const icons: { [key: string]: string } = {
      'Cleaning': '🧹',
      'Cooking': '👨‍🍳',
      'Gardening': '🌱'
    };
    return icons[serviceName] || '🏠';
  }
}

