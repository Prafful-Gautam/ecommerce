import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './product.service';
import { ProductComponent } from './product/product.component';
import { MaterialModule } from '../material/material.module';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    HttpClientModule,
    MatCardModule,

    MaterialModule
  ],
  providers: [ProductService]
})
export class ProductModule { }
