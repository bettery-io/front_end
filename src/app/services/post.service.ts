
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:80';

  post(path, data) {
    return this.http.post(`${this.url}/${path}`, data);
  }
  
}