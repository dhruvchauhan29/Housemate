import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpertState } from '../reducers/expert.reducer';

export const selectExpertState = createFeatureSelector<ExpertState>('expert');

export const selectExpertJobs = createSelector(
  selectExpertState,
  (state) => state.jobs
);

export const selectExpertStats = createSelector(
  selectExpertState,
  (state) => state.stats
);

export const selectExpertLoading = createSelector(
  selectExpertState,
  (state) => state.loading
);

export const selectExpertError = createSelector(
  selectExpertState,
  (state) => state.error
);

export const selectPendingJobs = createSelector(
  selectExpertJobs,
  (jobs) => jobs.filter(job => job.status === 'Pending')
);

export const selectUpcomingJobs = createSelector(
  selectExpertJobs,
  (jobs) => jobs.filter(job => job.status === 'Accepted')
);

export const selectCompletedJobs = createSelector(
  selectExpertJobs,
  (jobs) => jobs.filter(job => job.status === 'Completed')
);
