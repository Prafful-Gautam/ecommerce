import { Injectable } from '@angular/core';
import { Subject, of, Observable } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private user$ = new Subject<User>();
  constructor() { }
  login(email: string, password: string){
    const loginCredentials = {email, password};
    console.log(loginCredentials);
    return of(loginCredentials);
  }

  get user(){
    return this.user$.asObservable();
  }
 logout(){
   this.setUser(null);
   console.log('User is logout');
 }
  register(user: any){
    this.setUser(user);
    return of(user);
  }

  private setUser(user){
    this.user$.next(user);
  }


}
