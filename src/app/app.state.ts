import {User} from './models/User.model';
import {Coins} from './models/Coins.model';

export interface AppState {
    readonly user: User[];
    readonly coins: Coins[];
}