import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

   //Declare variables
   errorMessage: string = '';

   constructor(private authService: AuthService,
               private router: Router,
               private renderer: Renderer2) {}
 
   // Function that accepts login information and authenticates if user is a part of the system
   onLogin(form: any) {
     if (form.valid) {
       this.authService.loginUser(form.value).subscribe(
         response => {
           if (response && response.id) {
             console.log('Login successful', response);
             const Id = response.id;
             localStorage.setItem('id', Id);//saves id to cookie
             this.router.navigate(['/']);
           } else if (response && response.error) {
             this.errorMessage = response.error;  // sends an error message
             console.error('Login failed:', response.error);
           } else {
             this.errorMessage = 'Login failed: Unknown error';
             console.error('Login failed: Response is missing id or error');
           }
         },
         error => {
           this.errorMessage = 'Login failed: Invalid credentials';
           console.error('Login failed', error);
         }
       );
     } else {
       this.errorMessage = 'Please fill out the form correctly';
     }
   }
}
