import { Action } from '@ngrx/store';
import { Coins } from './../models/Coins.model';
import * as CoinsActions from './../actions/coins.actions';

export function coinsReducer(state: Coins[] = [], action: CoinsActions.Actions) {
    switch (action.type) {
        case CoinsActions.ADD_COINS:
            return [...state, action.payload];
        case CoinsActions.UPDATE_COINS:
            return [action.payload];    
        default:
            return state;
    }
}