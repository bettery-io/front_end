import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Invites } from '../models/Invites.model';

export const ADD_INVITES = "[INVITES] Add";
export const UPDATE_INVITES = "[INVITES] UPDATE"; 

export class AddInvites implements Action{
    readonly type = ADD_INVITES

    constructor(public payload: Invites) {}
}

export class UpdateInvites implements Action{
    readonly type = UPDATE_INVITES

    constructor(public payload: Invites) {}
}

export type Actions = AddInvites | UpdateInvites;