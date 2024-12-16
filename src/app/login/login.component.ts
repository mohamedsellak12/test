import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [RouterModule , FormsModule ,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  credentials = {
    email: '',
    password: '',
  };
  message: string | null = null;  
  isSubmitting = false;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:3000/user'; // Replace with your backend URL

  constructor(private http: HttpClient, private router: Router ){
   
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null; // Clear any previous error

    // Make the POST request to the login endpoint directly in the component
    this.http.post(`${this.apiUrl}/login`, this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token); 
        localStorage.setItem('user', JSON.stringify(response.user));// Store the token in localStorage
        this.router.navigate(['/dashboard'],{
          state: { user: response.user }
        }); // Redirect to the dashboard
      },
      error: (error :any) => {
        console.log('Login error:', error);
        this.errorMessage =  'Login failed , please try again ';
        alert(this.errorMessage);
        this.isSubmitting = false; // Re-enable the button if error occurs
      },
      complete: () => {
        this.isSubmitting = false; // Re-enable the button after the request is complete
      },
    });
  }
}
