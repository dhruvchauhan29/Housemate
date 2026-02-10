import { createReducer, on } from '@ngrx/store';
import { Job, ExpertStats } from '../models/booking.model';
import * as ExpertActions from '../actions/expert.actions';

export interface ExpertState {
  jobs: Job[];
  stats: ExpertStats | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ExpertState = {
  jobs: [],
  stats: null,
  loading: false,
  error: null
};

export const expertReducer = createReducer(
  initialState,
  
  // Load Jobs
  on(ExpertActions.loadJobs, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ExpertActions.loadJobsSuccess, (state, { jobs }) => ({
    ...state,
    jobs,
    loading: false,
    error: null
  })),
  
  on(ExpertActions.loadJobsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Expert Stats
  on(ExpertActions.loadExpertStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ExpertActions.loadExpertStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null
  })),
  
  on(ExpertActions.loadExpertStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Job Actions
  on(ExpertActions.acceptJob, (state, { jobId }) => ({
    ...state,
    jobs: state.jobs.map(job =>
      job.id === jobId ? { ...job, status: 'Accepted' as const } : job
    )
  })),
  
  on(ExpertActions.rejectJob, (state, { jobId }) => ({
    ...state,
    jobs: state.jobs.map(job =>
      job.id === jobId ? { ...job, status: 'Rejected' as const } : job
    )
  })),
  
  on(ExpertActions.completeJob, (state, { jobId }) => ({
    ...state,
    jobs: state.jobs.map(job =>
      job.id === jobId ? { ...job, status: 'Completed' as const } : job
    )
  }))
);
