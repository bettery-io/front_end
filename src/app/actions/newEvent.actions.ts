import {createAction, props} from '@ngrx/store';

export enum ActionTypes {
  CREATE_EVENT = `[EVENT] Create event`,
  FORM_DATA = '[DATA] Form_data'
}

export const createEventAction = createAction(
  ActionTypes.CREATE_EVENT,
  props<{data: any}>()
);

export const formDataAction = createAction(
  ActionTypes.FORM_DATA,
  props<{formData: string}>()
);
