import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createEventAction} from '../actions/newEvent.actions';
import {LandingStateInterface} from '../models/landingState.model';

export const landingFeatureSelector = createFeatureSelector<LandingStateInterface>('event');

export const newEventSelector = createSelector(
  landingFeatureSelector,
  (authState: LandingStateInterface) => authState.newEvent
);

const initialState = {
  newEvent: ''
};

export const createEventReducer = createReducer(
  initialState,
  on(createEventAction,
    (state, action): LandingStateInterface => ({
      ...state,
      newEvent: action.data
    })
  )
);
