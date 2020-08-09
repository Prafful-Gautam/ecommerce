import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    const isAuth = this.authService.getisUserAuth();
    console.log(isAuth);
    if (!isAuth){
      this.router.navigate(['/login']);
    }
    return isAuth;
  }

}
