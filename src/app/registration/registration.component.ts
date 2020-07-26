import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'pm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
register: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.register = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.compose([Validators.required, this.passMatch])]
    })
  }
  passMatch(control: FormControl){
    const password = control.root.get('password');
    return password && control.value !== password.value ? {passwordMatch: true} : null;
  }
  get f(){
    return this.register.controls;
  }

  onSubmit(){
    if(this.register.invalid){
      return;
    }
    console.log(this.register.value);
  }

}
