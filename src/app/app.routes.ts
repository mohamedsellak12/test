import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGardService } from './services/auth-gard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginGardService } from './services/login-gard.service';
import { AddPostComponent } from './add-post/add-post.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [LoginGardService], 
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [LoginGardService], 
   

  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGardService],
    children: [
      {
        path: 'profile', // Nested route under Dashboard
        component: ProfileComponent,
        title: 'Profile',
      },{
        path:'addpost',
        component: AddPostComponent,
        title: 'Post',
      }
    ],
  },
];
