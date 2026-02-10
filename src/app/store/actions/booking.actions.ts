import { createAction, props } from '@ngrx/store';
import { Service, Expert, TimeSlot, Address, Coupon, PaymentStatus } from '../models/booking.model';

// Service Selection Actions
export const selectService = createAction(
  '[Booking] Select Service',
  props<{ service: Service }>()
);

export const clearService = createAction(
  '[Booking] Clear Service'
);

// Expert Selection Actions
export const selectExpert = createAction(
  '[Booking] Select Expert',
  props<{ expert: Expert }>()
);

export const clearExpert = createAction(
  '[Booking] Clear Expert'
);

// Date and Time Actions
export const selectDate = createAction(
  '[Booking] Select Date',
  props<{ date: string }>()
);

export const selectFrequency = createAction(
  '[Booking] Select Frequency',
  props<{ frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly' }>()
);

export const selectTimeSlot = createAction(
  '[Booking] Select Time Slot',
  props<{ timeSlot: TimeSlot }>()
);

export const selectDuration = createAction(
  '[Booking] Select Duration',
  props<{ duration: number }>()
);

// Address Actions
export const selectAddress = createAction(
  '[Booking] Select Address',
  props<{ address: Address }>()
);

export const addAddress = createAction(
  '[Booking] Add Address',
  props<{ address: Address }>()
);

export const updateAddress = createAction(
  '[Booking] Update Address',
  props<{ address: Address }>()
);

export const deleteAddress = createAction(
  '[Booking] Delete Address',
  props<{ addressId: string }>()
);

// Coupon Actions
export const applyCoupon = createAction(
  '[Booking] Apply Coupon',
  props<{ coupon: Coupon }>()
);

export const removeCoupon = createAction(
  '[Booking] Remove Coupon'
);

// Payment Actions
export const initiatePayment = createAction(
  '[Booking] Initiate Payment'
);

export const paymentSuccess = createAction(
  '[Booking] Payment Success',
  props<{ transactionId: string }>()
);

export const paymentFailure = createAction(
  '[Booking] Payment Failure',
  props<{ message: string }>()
);

export const resetPaymentStatus = createAction(
  '[Booking] Reset Payment Status'
);

// Booking Actions
export const calculateTotal = createAction(
  '[Booking] Calculate Total'
);

export const resetBooking = createAction(
  '[Booking] Reset Booking'
);

export const completeBooking = createAction(
  '[Booking] Complete Booking'
);
