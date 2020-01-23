import { Action } from '@ngrx/store';
import { Invites } from './../models/Invites.model';
import * as InvitesAction from './../actions/invites.actions';

export function invitesReducer(state: Invites[] = [], action: InvitesAction.Actions) {
    switch (action.type) {
        case InvitesAction.ADD_INVITES:
            return [...state, action.payload];
        case InvitesAction.UPDATE_INVITES:           
            return [action.payload]
        default:
            return state;
    }
}