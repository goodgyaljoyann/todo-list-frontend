import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5300/api/authentication'; // initiate backend API URL
  private token: string | null = null;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}
  
  //gets token generated by system
  getToken() {
    return this.token;
  }
  
  //checks if user is logged into system
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  
  //Creates an account for user on platform
  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      // Handling the successful response
      map((response: any) => {
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
        // Returning the response if needed
        return response;
      })
    );
  }
  //logs user into the system
  loginUser(user: any): Observable<any> {
    return this.http.post<{ token: string, id: string }>(`${this.apiUrl}/login`, user)
      .pipe(
        map(response => {
          if (response && response.token && response.id) {
            this.token = response.token; // Save the token
            this.saveUserId(response.id); // Save the user ID
            this.authStatusListener.next(true); // Update auth status
            return response; // Return the response
          } else {
            throw new Error('Invalid response from server: token or id is missing');
          }
        }),
        catchError(error => {
          throw new Error('Error occurred while logging in: ' + error.message);
        })
      );
  }
  

  saveUserId(Id: string): void {
    // Save customer_id as a cookie or in local storage
    this.cookieService.set('id', Id);
    // can also use localStorage.setItem('customer_id', customerId);
  }

  getUserId(): string {
    // Retrieve customer_id from cookie or local storage
    return this.cookieService.get('id');
    // can also use return localStorage.getItem('customer_id');
  }
  
  
  //logs user out from system
  logout() {
    // Clear token from local storage
    localStorage.removeItem('token');

    // Clear customer ID from local storage
    localStorage.removeItem('id');

    // Clear any other necessary state
    this.token = null;
    this.authStatusListener.next(false);
    
    // Redirect to the login page
    this.router.navigate(['/login']);
}

//Checks whether or not user is authenticated/logged in
isAuthenticated(): boolean {
  return this.token !== null;
}
 
}

