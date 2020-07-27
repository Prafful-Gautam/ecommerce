import { Injectable } from '@angular/core';
import { Subject, of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '../user';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private user$ = new Subject<User>();
apiUrl = 'http://localhost:4050/api/auth/';
  constructor(private http: HttpClient) { }
  login(email: string, password: string){
    const loginCredentials = {email, password};
    console.log('login credentials', loginCredentials);

    return this.http.post<User>(`${this.apiUrl}login`, loginCredentials)
      .pipe(switchMap(foundUser => {
        this.setUser(foundUser);
        console.log('user found', foundUser);
        return of(foundUser);
      }),
      catchError(err => {
        return throwError('Your login details not varified', err);
      })
      );
  }

  get user(){
    return this.user$.asObservable();
  }
 logout(){
   this.setUser(null);
   console.log('User is logout');
 }
  register(user: any){
    return this.http.post(`${this.apiUrl}register`, user).pipe(
      switchMap(savedUser => {
        this.setUser(savedUser);
        console.log('user registered successfully', savedUser);
        return of(savedUser);
      }),
      catchError(err => {
        console.log('server error occured', err);
        return throwError('Registration falied');
      })
    );
  }

  private setUser(user){
    this.user$.next(user);
  }


}
