
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {IPprod, IPtest} from '../config/keys';

@Injectable()
export class GetService {

  constructor(private http: HttpClient) { }

  url = environment.production ? IPprod : IPtest;
  //url = "http://localhost:80"

  get(path: string) {
    return this.http.get(`${this.url}/${path}`);
  }

}
