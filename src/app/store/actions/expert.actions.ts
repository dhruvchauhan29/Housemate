import { createAction, props } from '@ngrx/store';
import { Job, ExpertStats } from '../models/booking.model';

// Expert Job Actions
export const loadJobs = createAction(
  '[Expert] Load Jobs'
);

export const loadJobsSuccess = createAction(
  '[Expert] Load Jobs Success',
  props<{ jobs: Job[] }>()
);

export const loadJobsFailure = createAction(
  '[Expert] Load Jobs Failure',
  props<{ error: string }>()
);

// Expert Stats Actions
export const loadExpertStats = createAction(
  '[Expert] Load Expert Stats'
);

export const loadExpertStatsSuccess = createAction(
  '[Expert] Load Expert Stats Success',
  props<{ stats: ExpertStats }>()
);

export const loadExpertStatsFailure = createAction(
  '[Expert] Load Expert Stats Failure',
  props<{ error: string }>()
);

// Job Actions
export const acceptJob = createAction(
  '[Expert] Accept Job',
  props<{ jobId: string }>()
);

export const rejectJob = createAction(
  '[Expert] Reject Job',
  props<{ jobId: string }>()
);

export const completeJob = createAction(
  '[Expert] Complete Job',
  props<{ jobId: string }>()
);
