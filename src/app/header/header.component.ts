import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'pm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
 user: {email: string, name: string};

  userSub: Subscription;
  authSub: Subscription;
  isUserAuth = false;
  constructor(private authService: AuthService, private router: Router) {
  this.authSub = this.authService.findMe().subscribe(user =>{
     this.user = {email: user.email, name: user.name};
     console.log(this.user)
    });
  this.userSub = this.authService.user.subscribe(user => this.user = user);
   }

  ngOnInit(){

  }

  logout(){
    this.authService.logout();
    this.isUserAuth = false;
    this.router.navigate(['/']);
  }

  ngOnDestroy() {

    this.userSub.unsubscribe();
    this.authSub.unsubscribe();

  }

}
