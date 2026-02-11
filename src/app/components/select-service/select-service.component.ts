import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../store/app.state';
import { Service, Expert } from '../../store/models/booking.model';
import { selectService, selectExpert } from '../../store/actions/booking.actions';
import { selectSelectedService, selectSelectedExpert } from '../../store/selectors/booking.selectors';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExpertService, ExpertSearchParams, Expert as ApiExpert } from '../../services/expert.service';

@Component({
  selector: 'app-select-service',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
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

  // Expert listing
  filteredExperts: ApiExpert[] = [];
  isLoadingExperts = false;
  expertError: string | null = null;
  totalExperts = 0;
  
  // Search & Filters
  searchQuery = '';
  private searchSubject = new Subject<string>();
  showFilters = false;
  
  // Filter values
  minRating = 0;
  minPrice = 0;
  maxPrice = 200;
  readonly DEFAULT_MAX_PRICE = 200;
  verifiedOnly = false;
  selectedLanguage = '';
  sortBy = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 8;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private expertService: ExpertService
  ) {
    this.selectedService$ = this.store.select(selectSelectedService);
    this.selectedExpert$ = this.store.select(selectSelectedExpert);
  }

  ngOnInit() {
    this.selectedService$.subscribe(service => {
      this.selectedServiceId = service?.id || null;
      // Load experts when service is selected
      if (this.selectedServiceId) {
        this.loadExperts();
      }
    });
    
    this.selectedExpert$.subscribe(expert => {
      this.selectedExpertId = expert?.id || null;
    });
    
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadExperts();
    });
    
    // Load all experts on initialization (no filter)
    this.loadExperts();
  }

  selectServiceCard(service: Service) {
    this.selectedServiceId = service.id;
    this.store.dispatch(selectService({ service }));
    this.loadExperts();
  }

  selectExpertCard(expert: ApiExpert) {
    // Map API expert to store Expert model
    const storeExpert: Expert = {
      id: expert.id,
      name: expert.fullName,
      rating: expert.rating || 4.5,
      reviewCount: expert.reviewsCount || 100,
      experience: expert.experience,
      distance: expert.address || 'Unknown',
      pricePerHour: expert.pricePerHour || 100,
      verified: expert.verified || false,
      services: [expert.serviceCategory],
      languages: expert.languages || ['Hindi', 'English']
    };
    
    this.selectedExpertId = storeExpert.id;
    this.store.dispatch(selectExpert({ expert: storeExpert }));
  }

  loadExperts() {
    this.isLoadingExperts = true;
    this.expertError = null;
    
    // Get service name for filtering (if service is selected)
    const selectedService = this.services.find(s => s.id === this.selectedServiceId);
    const serviceName = selectedService?.name || '';
    
    const params: ExpertSearchParams = {
      serviceCategory: serviceName ? serviceName : undefined, // Allow empty to get all experts
      q: this.searchQuery || undefined,
      minRating: this.minRating > 0 ? this.minRating : undefined,
      minPrice: this.minPrice > 0 ? this.minPrice : undefined,
      maxPrice: this.maxPrice < this.DEFAULT_MAX_PRICE ? this.maxPrice : undefined,
      verified: this.verifiedOnly ? true : undefined,
      language: this.selectedLanguage || undefined,
      sort: (this.sortBy as any) || undefined,
      page: this.currentPage,
      limit: this.pageSize
    };
    
    this.expertService.searchExperts(params).subscribe({
      next: (result) => {
        this.filteredExperts = result.experts;
        this.totalExperts = result.total;
        this.isLoadingExperts = false;
      },
      error: (error) => {
        console.error('Error loading experts:', error);
        this.expertError = 'Failed to load experts. Please try again.';
        this.isLoadingExperts = false;
        this.filteredExperts = [];
      }
    });
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadExperts();
  }

  clearFilters() {
    this.searchQuery = '';
    this.minRating = 0;
    this.minPrice = 0;
    this.maxPrice = this.DEFAULT_MAX_PRICE;
    this.verifiedOnly = false;
    this.selectedLanguage = '';
    this.sortBy = '';
    this.currentPage = 1;
    this.loadExperts();
  }

  nextPage() {
    const maxPage = Math.ceil(this.totalExperts / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.loadExperts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadExperts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalExperts / this.pageSize);
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

