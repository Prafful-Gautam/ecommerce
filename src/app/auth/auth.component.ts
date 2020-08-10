import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pm-auth',
  template: `
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
