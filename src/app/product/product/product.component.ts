import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';
import {ProductType} from '../product';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
dataSource = new MatTableDataSource<ProductType>();
// products: any[] = [];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.products.push(res);
      //this.onDataLoad(this.products);
     // console.log(this.products);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
    });
  //   this.productSub = this.productService.getProducts().subscribe(res => {
  //    for(let i=0; i< res.length; i++) {
  //     this.products.push(res[i]);
  //    }
  //   console.log(this.products);
  //   });
  // }

}



}
