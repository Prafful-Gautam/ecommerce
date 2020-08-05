import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
error: BehaviorSubject<string>;
login: FormGroup;
submit = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.error = new BehaviorSubject('');
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  get f(){
    return this.login.controls;
  }
  private setError(error){
    return this.error.next(error);
  }
onSubmit() {
  if (this.login.invalid){
    this.submit = true;
    console.log(this.f);
    return;
  }
  this.setError('');
  const user = this.login.value;
  this.authService.login(user.email, user.password).subscribe((res) => this.router.navigate(['/']),
  err => {this.setError(err.error); this.submit = true;}
  );
}
}
