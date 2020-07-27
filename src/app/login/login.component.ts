import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
error = '';
login: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  get f(){
    return this.login.controls;
  }
onSubmit() {
  if (this.login.invalid){
    console.log(this.f);
    return;
  }
  const user = this.login.value;
  this.authService.login(user.email, user.password).subscribe((res) => this.router.navigate(['/']),
  err => this.error = err
  );
}
}
