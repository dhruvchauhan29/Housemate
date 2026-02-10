import { Expert } from '../../store/models/booking.model';

export const MOCK_EXPERTS: Expert[] = [
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
