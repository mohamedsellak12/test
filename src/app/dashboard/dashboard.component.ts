import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ RouterModule , RouterOutlet ,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any;
  openLogoutPopup: boolean = false;

  constructor(private userService :UserServiceService,private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    } // Retrieve the user data
    console.log('User data:', this.user);
  }
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
  logout(){
    this.userService.logout();
  }
  ShowPopup(event: Event): void {
    event.preventDefault();
    this.openLogoutPopup = true;
  }
  ClosePopup(): void {
    this.openLogoutPopup = false;
  }
}
