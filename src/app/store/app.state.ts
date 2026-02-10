import { ActionReducerMap } from '@ngrx/store';
import { BookingState, bookingReducer } from './reducers/booking.reducer';
import { ExpertState, expertReducer } from './reducers/expert.reducer';

export interface AppState {
  booking: BookingState;
  expert: ExpertState;
}

export const reducers: ActionReducerMap<AppState> = {
  booking: bookingReducer,
  expert: expertReducer
};
