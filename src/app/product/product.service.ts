import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get<{arrayOfProducts}>('product.json').pipe(map(res => {
      return res.arrayOfProducts;
    }));
  }
}
