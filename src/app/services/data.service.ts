import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  randomQuotes: any;

  constructor(private http: HttpClient) { }
  
}
