import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pm-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
// productSub: Subscription;
products: Observable<any>;
// products: any[] = [];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  //   this.productSub = this.productService.getProducts().subscribe(res => {
  //    for(let i=0; i< res.length; i++) {
  //     this.products.push(res[i]);
  //    }
  //   console.log(this.products);
  //   });
  // }

}
}
