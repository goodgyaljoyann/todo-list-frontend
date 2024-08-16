import { Component } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService) {}

  //function that registers user on the system
  onSignup(form: any) {
    if (form.valid) {
      this.authService.registerUser(form.value).subscribe(
        response => {
          console.log('Signup successful', response);
        },
        error => {
          console.error('Signup failed', error);
        }
      );
    }
  }
}
