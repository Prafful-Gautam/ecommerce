import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CartItem } from '../core/cart/cart-item';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

interface MyCart {
  value: CartItem;
  count: number;
}
@Component({
  selector: 'pm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() user: any;

  @Output() logoutEvent = new EventEmitter<any>();

  cartObservable: Observable<any>;
  constructor(private authService: AuthService, private router: Router,
              private store: Store<{shop: [], item: [], cart: CartItem[]}>) {
                this.cartObservable = store.pipe(select('shop'));
                this.cartObservable.subscribe(data => {
                  this.cart = data.cart;
                  //this.uniqueField();
                  this.myCart = this.compressArray(this.cart);
                  console.log('.........>',this.myCart)
                  this.total = 0;
                  for(let i=0; i<this.myCart.length; i++){
                    let itemTotal = null;
                    itemTotal = this.myCart[i].value.price * this.myCart[i].count;
                    this.total = this.total + itemTotal;
                  }
                  console.log('total-->',this.total);
                });
              }
  cart: CartItem[] = [];
  myCart: MyCart[] = [];
  total: number;
  ngOnInit(){

  }

  uniqueField() {
    this.myCart = this.cart.reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
    //console.log('------------>', this.myCart);

  }
  compressArray(original) {

    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);

    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {

      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i] == copy[w]) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {value: '', count: null};
        a.value = original[i];
        a.count = myCount;
        compressed.push(a);
      }
    }
    return compressed;
  };

  // logout(){
  //   this.authService.logout();
  //   this.isUserAuth = false;
  //   this.router.navigate(['/']);
  // }

  ngOnDestroy() {


  }

}
