import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from './category';
import { Observable } from 'rxjs';

const API_URL = "http://localhost:5000/api/category/";

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL);
  }
}
