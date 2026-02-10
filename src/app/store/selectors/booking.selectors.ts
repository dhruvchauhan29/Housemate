import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from '../reducers/booking.reducer';

export const selectBookingState = createFeatureSelector<BookingState>('booking');

export const selectBooking = createSelector(
  selectBookingState,
  (state) => state.booking
);

export const selectSelectedService = createSelector(
  selectBooking,
  (booking) => booking.service
);

export const selectSelectedExpert = createSelector(
  selectBooking,
  (booking) => booking.expert
);

export const selectSelectedDate = createSelector(
  selectBooking,
  (booking) => booking.date
);

export const selectSelectedFrequency = createSelector(
  selectBooking,
  (booking) => booking.frequency
);

export const selectSelectedTimeSlot = createSelector(
  selectBooking,
  (booking) => booking.timeSlot
);

export const selectSelectedDuration = createSelector(
  selectBooking,
  (booking) => booking.duration
);

export const selectSelectedAddress = createSelector(
  selectBooking,
  (booking) => booking.address
);

export const selectAppliedCoupon = createSelector(
  selectBooking,
  (booking) => booking.coupon
);

export const selectPricing = createSelector(
  selectBooking,
  (booking) => ({
    baseAmount: booking.baseAmount || 0,
    gst: booking.gst || 0,
    discount: booking.discount || 0,
    totalAmount: booking.totalAmount || 0
  })
);

export const selectAddresses = createSelector(
  selectBookingState,
  (state) => state.addresses
);

export const selectPaymentStatus = createSelector(
  selectBookingState,
  (state) => state.payment
);

export const selectIsBookingComplete = createSelector(
  selectBooking,
  (booking) => !!(
    booking.service &&
    booking.expert &&
    booking.date &&
    booking.timeSlot &&
    booking.address
  )
);
