import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      headers: req.headers.set("Authorization", "Bearer "+ token)
    });
    return next.handle(authReq);
  }
}
