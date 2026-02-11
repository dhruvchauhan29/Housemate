import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Expert {
  id: string;
  email: string;
  fullName: string;
  age?: number;
  address?: string;
  mobileNumber: string;
  serviceCategory: string;
  experience: string;
  pricePerHour?: number;
  rating?: number;
  reviewsCount?: number;
  verified?: boolean;
  languages?: string[];
}

export interface ExpertSearchParams {
  serviceCategory?: string;
  q?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
  language?: string;
  sort?: 'rating' | 'price' | 'experience' | 'distance';
  page?: number;
  limit?: number;
}

export interface ExpertSearchResult {
  experts: Expert[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:3000/experts';

  constructor(private http: HttpClient) {}

  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(this.apiUrl);
  }

  getExpertById(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/${id}`);
  }

  getExpertsByService(serviceCategory: string): Observable<Expert[]> {
    return this.http.get<Expert[]>(`${this.apiUrl}?serviceCategory=${serviceCategory}`);
  }

  searchExperts(params: ExpertSearchParams): Observable<ExpertSearchResult> {
    let httpParams = new HttpParams();
    
    // Add service category filter
    if (params.serviceCategory) {
      httpParams = httpParams.set('serviceCategory', params.serviceCategory);
    }
    
    // Fetch all experts and apply client-side filtering
    return this.http.get<Expert[]>(this.apiUrl, { params: httpParams }).pipe(
      map(experts => {
        let filtered = experts;
        
        // Apply search query filter (name, languages)
        if (params.q) {
          const query = params.q.toLowerCase();
          filtered = filtered.filter(expert => 
            expert.fullName.toLowerCase().includes(query) ||
            (expert.languages && expert.languages.some(lang => lang.toLowerCase().includes(query)))
          );
        }
        
        // Apply rating filter
        if (params.minRating !== undefined) {
          filtered = filtered.filter(expert => 
            (expert.rating || 0) >= params.minRating!
          );
        }
        
        // Apply price range filter
        if (params.minPrice !== undefined) {
          filtered = filtered.filter(expert => 
            (expert.pricePerHour || 0) >= params.minPrice!
          );
        }
        if (params.maxPrice !== undefined) {
          filtered = filtered.filter(expert => 
            (expert.pricePerHour || 0) <= params.maxPrice!
          );
        }
        
        // Apply verified filter
        if (params.verified !== undefined) {
          filtered = filtered.filter(expert => expert.verified === params.verified);
        }
        
        // Apply language filter
        if (params.language) {
          filtered = filtered.filter(expert => 
            expert.languages && expert.languages.some(lang => 
              lang.toLowerCase() === params.language!.toLowerCase()
            )
          );
        }
        
        // Apply sorting
        if (params.sort) {
          filtered = this.sortExperts(filtered, params.sort);
        }
        
        const total = filtered.length;
        
        // Apply pagination
        if (params.page && params.limit) {
          const startIndex = (params.page - 1) * params.limit;
          filtered = filtered.slice(startIndex, startIndex + params.limit);
        }
        
        return {
          experts: filtered,
          total: total
        };
      })
    );
  }

  private sortExperts(experts: Expert[], sortBy: string): Expert[] {
    const sorted = [...experts];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      case 'price':
        return sorted.sort((a, b) => (a.pricePerHour || 0) - (b.pricePerHour || 0));
      
      case 'experience':
        return sorted.sort((a, b) => {
          const aYears = this.extractYears(a.experience);
          const bYears = this.extractYears(b.experience);
          return bYears - aYears;
        });
      
      case 'distance':
        return sorted.sort((a, b) => {
          const aDistance = this.extractDistance(a.address || '');
          const bDistance = this.extractDistance(b.address || '');
          return aDistance - bDistance;
        });
      
      default:
        return sorted;
    }
  }

  private readonly MAX_DISTANCE = 999;

  private extractYears(experience: string): number {
    const match = experience.match(/(\d+)\s*years?/i);
    return match ? parseInt(match[1]) : 0;
  }

  private extractDistance(address: string): number {
    const match = address.match(/([\d.]+)\s*km/i);
    return match ? parseFloat(match[1]) : this.MAX_DISTANCE;
  }
}
