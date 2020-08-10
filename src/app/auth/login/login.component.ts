import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
error: BehaviorSubject<string>;
err = {msg:'', status: false};
login: FormGroup;
submit = false;
  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.error = new BehaviorSubject('');
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2000});
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
  err => {this.setError(err.error);
          this.submit = true;
          console.log(this.error);
          this.err = {msg:'This Email is not registered or Invalid Password', status: true};
          this.openSnackBar(this.err.msg, 'close');
    }
  );
}
}
