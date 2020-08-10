import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/product/product.service';
import { SelectProduct } from '../home.component';

@Component({
  selector: 'pm-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: SelectProduct) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
