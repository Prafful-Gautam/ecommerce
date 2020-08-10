import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';
import {ProductType} from '../product';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { CartItem } from 'src/app/core/cart/cart-item';
import { AddToCart, RemoveFromCart } from 'src/app/core/store/actions';

@Component({
  selector: 'pm-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
// productSub: Subscription;
@ViewChild(MatSort) sort: MatSort;
displayedColumns: string[] = ['imgUrl', 'name', 'price', 'cart'];
products: ProductType[] = [];
fruits: ProductType[] = [];
dataSource = new MatTableDataSource<ProductType>();
fruitSource = new MatTableDataSource<ProductType>();
inCart = false;
  constructor(private productService: ProductService, private store: Store <{shop: [], cart: [], item: []}>) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.products.push(res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
    });

    this.productService.getFruits().subscribe(res => {
      this.fruits.push(res);
      this.fruitSource.data = res;
    });
  //   this.productSub = this.productService.getProducts().subscribe(res => {
  //    for(let i=0; i< res.length; i++) {
  //     this.products.push(res[i]);
  //    }
  //   console.log(this.products);
  //   });
  // }

}
addToCart(item: CartItem) {
  this.store.dispatch(new AddToCart(item));
  this.inCart = true;
}

removeFromCart(item: CartItem) {
  this.store.dispatch(new RemoveFromCart(item));
  this.inCart = false;
}


}
