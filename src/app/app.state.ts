import {User} from './models/User.model';

export interface AppState {
    readonly user: User[];
}