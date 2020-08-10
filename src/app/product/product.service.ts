import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ProductModule } from './product.module';

@Injectable({providedIn: 'root'})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get<{arrayOfProducts}>('product.json').pipe(map(res => {
      return res.arrayOfProducts;
    }));
  }
  getFruits(){
    return this.http.get<{fruits}>('fruits.json').pipe(map(res =>{
      return res.fruits;
    }));
  }
}
