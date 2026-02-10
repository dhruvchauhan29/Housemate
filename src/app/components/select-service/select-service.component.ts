import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../../store/app.state';
import { Service } from '../../store/models/booking.model';
import { selectService } from '../../store/actions/booking.actions';
import { selectSelectedService } from '../../store/selectors/booking.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent implements OnInit {
  selectedService$: Observable<Service | undefined>;
  selectedServiceId: string | null = null;

  services: Service[] = [
    {
      id: '1',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Cleaning service icon will be added from Figma
    },
    {
      id: '2',
      name: 'Cooking',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Cooking service icon will be added from Figma
    },
    {
      id: '3',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Gardening service icon will be added from Figma
    },
    {
      id: '4',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Cleaning service icon (repeated) will be added from Figma
    },
    {
      id: '5',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Gardening service icon (repeated) will be added from Figma
    },
    {
      id: '6',
      name: 'Cooking',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Cooking service icon (repeated) will be added from Figma
    },
    {
      id: '7',
      name: 'Gardening',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Gardening service icon (repeated) will be added from Figma
    },
    {
      id: '8',
      name: 'Cleaning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempur incididunt',
      pricePerHour: 150,
      // Image placeholder: Cleaning service icon (repeated) will be added from Figma
    }
  ];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.selectedService$ = this.store.select(selectSelectedService);
  }

  ngOnInit() {
    this.selectedService$.subscribe(service => {
      this.selectedServiceId = service?.id || null;
    });
  }

  selectServiceCard(service: Service) {
    this.selectedServiceId = service.id;
    this.store.dispatch(selectService({ service }));
  }

  nextStep() {
    if (this.selectedServiceId) {
      this.router.navigate(['/book-service/select-expert']);
    }
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

