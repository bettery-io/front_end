import {createAction, props} from '@ngrx/store';

export enum ActionTypes {
  CREATE_EVENT = `[EVENT] Create event`,
}

export const createEventAction = createAction(
  ActionTypes.CREATE_EVENT,
  props<{data: any}>()
);
