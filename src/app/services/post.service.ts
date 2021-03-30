
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {IPprod, IPtest} from '../config/keys';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

  url = environment.production ? IPprod : IPtest;
  //url = "http://localhost:80"


  post(path: string, data: Object) {
    return this.http.post(`${this.url}/${path}`, data);
  }

}
