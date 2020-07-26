import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
login: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
onSubmit() {
  console.log(this.login.value.email.error);
console.log(this.login.value);
}
}
