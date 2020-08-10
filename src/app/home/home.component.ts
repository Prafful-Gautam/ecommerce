import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProductService } from '../product/product.service';
import { Observable} from 'rxjs';
import {ProductType} from '../product/product';
import {ViewComponent} from './view/view.component';

export interface SelectProduct{
  product: ProductType;
}

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
prodObs: Observable<ProductType>;
products: ProductType[] = [];
selectProduct = '1st product';
  constructor(private productService: ProductService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.prodObs = this.productService.getProducts();
    this.prodObs.subscribe( res => {
      this.products.push(res);
    });
  }

  openDialog(i: number): void {
    console.log(i);
    console.log('000000?>>>', this.products[0][i]);
    this.dialog.open(ViewComponent, {
      data: {product: this.products[0][i]}
    });


  }
  ngOnDestroy(): void {

  }
}
