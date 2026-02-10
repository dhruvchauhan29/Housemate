export interface Service {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  // Image placeholder: Service icon image will be added from Figma
  imageUrl?: string;
}

export interface Expert {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experience: string;
  distance: string;
  pricePerHour: number;
  verified: boolean;
  services: string[];
  languages: string[];
  // Image placeholder: Expert profile image will be added from Figma
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Address {
  id: string;
  label: string;
  serviceAddress: string;
  city: string;
  state: string;
  pinCode: string;
  contactName: string;
  contactNumber: string;
  alternateContactNumber?: string;
  houseType: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  valid: boolean;
  errorMessage?: string;
}

export interface BookingDetails {
  service?: Service;
  expert?: Expert;
  date?: string;
  frequency?: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  timeSlot?: TimeSlot;
  duration?: number;
  address?: Address;
  coupon?: Coupon;
  baseAmount?: number;
  gst?: number;
  discount?: number;
  totalAmount?: number;
}

export interface PaymentStatus {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'IDLE';
  transactionId?: string;
  message?: string;
}

export interface Job {
  id: string;
  serviceType: string;
  customerName: string;
  date: string;
  timeSlot: string;
  address: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
  earnings: number;
  duration: number;
}

export interface ExpertStats {
  totalJobs: number;
  upcomingJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
}
