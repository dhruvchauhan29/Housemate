import { createReducer, on } from '@ngrx/store';
import { BookingDetails, PaymentStatus, Address } from '../models/booking.model';
import * as BookingActions from '../actions/booking.actions';

export interface BookingState {
  booking: BookingDetails;
  addresses: Address[];
  payment: PaymentStatus;
}

export const initialState: BookingState = {
  booking: {},
  addresses: [],
  payment: {
    status: 'IDLE' as const
  }
};

export const bookingReducer = createReducer(
  initialState,
  
  // Service Selection
  on(BookingActions.selectService, (state, { service }) => ({
    ...state,
    booking: {
      ...state.booking,
      service
    }
  })),
  
  on(BookingActions.clearService, (state) => ({
    ...state,
    booking: {
      ...state.booking,
      service: undefined
    }
  })),
  
  // Expert Selection
  on(BookingActions.selectExpert, (state, { expert }) => ({
    ...state,
    booking: {
      ...state.booking,
      expert
    }
  })),
  
  on(BookingActions.clearExpert, (state) => ({
    ...state,
    booking: {
      ...state.booking,
      expert: undefined
    }
  })),
  
  // Date and Time
  on(BookingActions.selectDate, (state, { date }) => ({
    ...state,
    booking: {
      ...state.booking,
      date
    }
  })),
  
  on(BookingActions.selectFrequency, (state, { frequency }) => ({
    ...state,
    booking: {
      ...state.booking,
      frequency
    }
  })),
  
  on(BookingActions.selectTimeSlot, (state, { timeSlot }) => ({
    ...state,
    booking: {
      ...state.booking,
      timeSlot
    }
  })),
  
  on(BookingActions.selectDuration, (state, { duration }) => ({
    ...state,
    booking: {
      ...state.booking,
      duration
    }
  })),
  
  // Address Management
  on(BookingActions.selectAddress, (state, { address }) => ({
    ...state,
    booking: {
      ...state.booking,
      address
    }
  })),
  
  on(BookingActions.addAddress, (state, { address }) => ({
    ...state,
    addresses: [...state.addresses, address]
  })),
  
  on(BookingActions.updateAddress, (state, { address }) => ({
    ...state,
    addresses: state.addresses.map(addr => 
      addr.id === address.id ? address : addr
    )
  })),
  
  on(BookingActions.deleteAddress, (state, { addressId }) => ({
    ...state,
    addresses: state.addresses.filter(addr => addr.id !== addressId)
  })),
  
  // Coupon
  on(BookingActions.applyCoupon, (state, { coupon }) => ({
    ...state,
    booking: {
      ...state.booking,
      coupon
    }
  })),
  
  on(BookingActions.removeCoupon, (state) => ({
    ...state,
    booking: {
      ...state.booking,
      coupon: undefined,
      discount: undefined
    }
  })),
  
  // Payment
  on(BookingActions.initiatePayment, (state) => ({
    ...state,
    payment: {
      status: 'PENDING' as const
    }
  })),
  
  on(BookingActions.paymentSuccess, (state, { transactionId }) => ({
    ...state,
    payment: {
      status: 'SUCCESS' as const,
      transactionId
    }
  })),
  
  on(BookingActions.paymentFailure, (state, { message }) => ({
    ...state,
    payment: {
      status: 'FAILED' as const,
      message
    }
  })),
  
  on(BookingActions.resetPaymentStatus, (state) => ({
    ...state,
    payment: {
      status: 'IDLE' as const
    }
  })),
  
  // Calculate Total
  on(BookingActions.calculateTotal, (state) => {
    const booking = state.booking;
    const baseAmount = (booking.expert?.pricePerHour || 0) * (booking.duration || 0);
    const gst = baseAmount * 0.18; // 18% GST
    let discount = 0;
    
    if (booking.coupon && booking.coupon.valid) {
      if (booking.coupon.discountType === 'PERCENTAGE') {
        discount = baseAmount * (booking.coupon.discount / 100);
      } else {
        discount = booking.coupon.discount;
      }
    }
    
    const totalAmount = baseAmount + gst - discount;
    
    return {
      ...state,
      booking: {
        ...booking,
        baseAmount,
        gst,
        discount,
        totalAmount
      }
    };
  }),
  
  // Reset Booking
  on(BookingActions.resetBooking, (state) => ({
    ...state,
    booking: {},
    payment: {
      status: 'IDLE' as const
    }
  }))
);
