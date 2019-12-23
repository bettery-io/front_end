
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

 // url = 'http://13.229.200.135';
  url = "http://localhost:80"


  post(path: string, data: Object) {
    return this.http.post(`${this.url}/${path}`, data);
  }
  
}