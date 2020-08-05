import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { User } from './user';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  user = {email: '', name: '', status: false};

  userSub: Subscription;
  authSub: Subscription;
  isUserAuth = false;

constructor(private authService: AuthService, private router: Router) {


   }

  ngOnInit(){
    this.authSub = this.authService.findMe().subscribe(user =>{
      this.user = user;

     });
    this.userSub = this.authService.user.subscribe(user => {this.user = user; console.log('---->', this.user);});

    this.authService.autoLogout();
    //this.authService.autoAuthLogin();

  }
  logout(){
      this.authService.logout();
      this.isUserAuth = false;
      this.router.navigate(['/']);
    }

    ngOnDestroy(){
      if(this.authSub){
      this.authSub.unsubscribe();
      }
      if(this.userSub){
        this.userSub.unsubscribe();
      }
    }
}
