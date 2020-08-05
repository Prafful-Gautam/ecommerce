import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

interface User {
  email: string;
  name: string;
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

  constructor(private authService: AuthService, private router: Router) {console.log(this.user)}

  ngOnInit(){

  }

  // logout(){
  //   this.authService.logout();
  //   this.isUserAuth = false;
  //   this.router.navigate(['/']);
  // }

  ngOnDestroy() {


  }

}
