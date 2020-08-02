import { Injectable } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '../user';
import { switchMap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
user$ = new Subject<{email: string, name: string}>();
private token: string;
tokenTimeout: any;
foundUser: User;
isUserAuth = false;

apiUrl = 'http://localhost:4050/api/auth/';
constructor(private http: HttpClient) { }

getToken() {
  return this.token;
}

get user(){
  return this.user$.asObservable();
}
  getisUserAuth() {
    console.log('---->', this.isUserAuth);
    return this.isUserAuth;
  }

  login(email: string, password: string){
    const loginCredentials = {email, password};
    console.log('login credentials', loginCredentials);

    return this.http.post<User>(`${this.apiUrl}login`, loginCredentials)
      .pipe(switchMap(foundUser => {

        this.token =  foundUser.token;
        console.log('user found', foundUser);
        if (this.token){
          const expiresIn = foundUser.expiresIn;
          this.tokenTimeout = setTimeout(() => {
            this.logout();
          }, expiresIn * 1000);
          console.log('=======>', foundUser);
          this.foundUser = foundUser;
          this.setUser(foundUser.user.email, foundUser.user.name);
          this.isUserAuth = true;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);

          this.saveAuthData(this.token, expirationDate, foundUser.user.email, foundUser.user.name);
        }
        return of(foundUser);
      }),
      catchError(err => {
        return throwError('Your login details not varified', err);
      })
      );
  }


  // autoAuthLogin(){
  //   const authInformation = this.getAuthData();
  //   console.log('authInfor===', authInformation);
  //   if(!authInformation){
  //     return;
  //   }
  //   const now = new Date();
  //   const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  //   console.log('expires in', expiresIn);
  //   if(expiresIn > 0){
  //     this.token = authInformation.token;
  //     this.isUserAuth = true;
  //     console.log('found user', authInformation);
  //     setTimeout(() => {
  //       this.logout();
  //     }, expiresIn);
  //     this.setUser(authInformation.email, authInformation.name);
  //     return of(authInformation);
  //   }
  // }

  autoLogout(){
  const authInformation = this.getAuthData();
  if(!authInformation){
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  console.log('Logout', expiresIn);
  if(expiresIn > 0) {
    setTimeout(() =>{
      this.logout();
    }, expiresIn);
  }
  }

 logout(){
   this.token = null;
   this.setUser(null, null);
   this.isUserAuth = false;
   this.clearAuthData();
   console.log('User is logout');
 }
 private saveAuthData(token: string, expirationDate: Date, email: string, name: string){
   localStorage.setItem('token', token);
   localStorage.setItem('expirationDate', expirationDate.toString());
   localStorage.setItem('email', email);
   localStorage.setItem('name', name);

  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
  }

  private getAuthData(){
   const token = localStorage.getItem('token');
   const expirationDate = localStorage.getItem('expirationDate');
   const email = localStorage.getItem('email');
   const name = localStorage.getItem('name');
   if(!token || !expirationDate || !email || !name){
     return;
   }
   return {
     token: token,
     expirationDate: new Date(expirationDate),
     email: email,
     name: name
   }
 }
 register(user: any){
    return this.http.post<any>(`${this.apiUrl}register`, user).pipe(
      switchMap(savedUser => {
        this.setUser(savedUser.email, savedUser.name);
        console.log('user registered successfully', savedUser);
        return of(savedUser);
      }),
      catchError(err => {
        console.log('server error occured', err);
        return throwError('Registration falied');
      })
      );
    }


 findMe(){
  const token = localStorage.getItem('token');


  return this.http.get<any>(`${this.apiUrl}findme`).pipe(
    switchMap(foundUser => {
      console.log(`User found!`, foundUser);
      this.setUser(foundUser.email, foundUser.name);
      return of(foundUser.user);
    }),
    catchError(err => {
      console.log('Your details not varified', err);
      return throwError('Your details not varified');
    })

    );
 }

 private setUser(email: string, name: string){
  const user = { email: email, name: name };
  console.log('user---------', user);
  this.user$.next(user);
}
}
