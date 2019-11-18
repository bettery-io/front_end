
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GetService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:80';

  get(path: string) {
    return this.http.get(`${this.url}/${path}`);
  }
  
}