import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { User } from './user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService){

  }
  ngOnInit(){

    //this.authService.autoAuthLogin();

  }


}
