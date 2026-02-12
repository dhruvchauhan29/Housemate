import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExpertService, Expert, ExpertSearchParams } from './expert.service';

describe('ExpertService', () => {
  let service: ExpertService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/experts';

  const mockExperts: Expert[] = [
    {
      id: '1',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      address: '2.3 km away',
      mobileNumber: '+1 (555) 987-6543',
      serviceCategory: 'Cleaning',
      experience: '5 years',
      pricePerHour: 100,
      rating: 4.7,
      reviewsCount: 122,
      verified: true,
      languages: ['Hindi', 'English']
    },
    {
      id: '2',
      email: 'sara@example.com',
      fullName: 'Sara Khan',
      address: '2.3 km away',
      mobileNumber: '+91 9876543210',
      serviceCategory: 'Cooking',
      experience: '8 years',
      pricePerHour: 100,
      rating: 4.7,
      reviewsCount: 122,
      verified: true,
      languages: ['Hindi', 'English']
    },
    {
      id: '3',
      email: 'test@example.com',
      fullName: 'Test Expert',
      address: '1.0 km away',
      mobileNumber: '+91 9999999999',
      serviceCategory: 'cleaning',
      experience: '3 years',
      pricePerHour: 120,
      rating: 4.5,
      reviewsCount: 50,
      verified: true,
      languages: ['Hindi', 'English']
    },
    {
      id: '4',
      email: 'garden@example.com',
      fullName: 'Garden Expert',
      address: '1.5 km away',
      mobileNumber: '+91 8888888888',
      serviceCategory: 'Gardening',
      experience: '4 years',
      pricePerHour: 110,
      rating: 4.8,
      reviewsCount: 80,
      verified: true,
      languages: ['Hindi', 'English']
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpertService]
    });
    service = TestBed.inject(ExpertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all experts', () => {
    service.getAllExperts().subscribe(experts => {
      expect(experts).toEqual(mockExperts);
      expect(experts.length).toBe(4);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should filter experts by service category case-insensitively', () => {
    const params: ExpertSearchParams = {
      serviceCategory: 'Cleaning'
    };

    service.searchExperts(params).subscribe(result => {
      // Should find both "Cleaning" and "cleaning" experts
      expect(result.experts.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.experts[0].fullName).toBe('Jane Smith');
      expect(result.experts[1].fullName).toBe('Test Expert');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should filter experts by service category with lowercase input', () => {
    const params: ExpertSearchParams = {
      serviceCategory: 'cleaning'
    };

    service.searchExperts(params).subscribe(result => {
      // Should find both "Cleaning" and "cleaning" experts regardless of input case
      expect(result.experts.length).toBe(2);
      expect(result.total).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should filter experts by service category with mixed case input', () => {
    const params: ExpertSearchParams = {
      serviceCategory: 'cLeAnInG'
    };

    service.searchExperts(params).subscribe(result => {
      // Should find both "Cleaning" and "cleaning" experts regardless of input case
      expect(result.experts.length).toBe(2);
      expect(result.total).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should filter experts by multiple criteria including case-insensitive service', () => {
    const params: ExpertSearchParams = {
      serviceCategory: 'Cleaning',
      minRating: 4.6
    };

    service.searchExperts(params).subscribe(result => {
      // Should find only Jane Smith (4.7 rating) since Test Expert has 4.5
      expect(result.experts.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.experts[0].fullName).toBe('Jane Smith');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should handle search query with case-insensitive name matching', () => {
    const params: ExpertSearchParams = {
      q: 'jane'
    };

    service.searchExperts(params).subscribe(result => {
      expect(result.experts.length).toBe(1);
      expect(result.experts[0].fullName).toBe('Jane Smith');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should return all experts when no service category filter is provided', () => {
    const params: ExpertSearchParams = {};

    service.searchExperts(params).subscribe(result => {
      expect(result.experts.length).toBe(4);
      expect(result.total).toBe(4);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });

  it('should apply pagination after filtering', () => {
    const params: ExpertSearchParams = {
      serviceCategory: 'Cleaning',
      page: 1,
      limit: 1
    };

    service.searchExperts(params).subscribe(result => {
      // Should still report total of 2, but only return 1 due to pagination
      expect(result.experts.length).toBe(1);
      expect(result.total).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockExperts);
  });
});
