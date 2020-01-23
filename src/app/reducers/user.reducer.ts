import { Action } from '@ngrx/store';
import { User } from './../models/User.model';
import * as UserActions from './../actions/user.actions';

export function userReducer(state: User[] = [], action: UserActions.Actions) {
    switch (action.type) {
        case UserActions.ADD_USER:
            return [...state, action.payload];
        case UserActions.UPDATE_USER:
           // state[0] = action.payload;
            return [action.payload]
        case UserActions.REMOVE_USER:
            return state = [];
        default:
            return state;
    }
}