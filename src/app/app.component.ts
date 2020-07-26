import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth.service';
import { User } from './user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  user: User;
  userSub: Subscription;
  constructor(private authService: AuthService, private router: Router){
  this.userSub = this.authService.user.subscribe(user => this.user = user);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
